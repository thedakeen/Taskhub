package company

import (
	"context"
	"errors"
	"github.com/golang-jwt/jwt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"strings"
)

func extractDeveloperID(tokenString string) (int64, error) {
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return 0, errors.New("invalid token format")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("invalid token claims")
	}

	uid, ok := claims["uid"].(float64)
	if !ok {
		return 0, errors.New("uid not found in token")
	}

	return int64(uid), nil
}

func (s *serverAPI) authenticate(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", status.Error(codes.Unauthenticated, "no metadata in request")
	}

	authHeader, ok := md["authorization"]
	if !ok || len(authHeader) == 0 {
		return "", status.Error(codes.Unauthenticated, "no authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader[0], "Bearer ")
	if tokenString == "" {
		return "", status.Error(codes.Unauthenticated, "empty token")
	}

	isValid, err := s.authClient.IsTokenValid(context.Background(), tokenString)
	if err != nil {
		return "", status.Error(codes.Unauthenticated, err.Error())
	}
	if !isValid {
		return "", status.Error(codes.Unauthenticated, "invalid token")
	}

	return tokenString, nil
}
