package auth

import (
	authv1 "auth/gen/auth"
	"auth/internal/grpc/structs"
	"auth/internal/storage"
	"context"
	"errors"
	"github.com/go-playground/validator"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Auth interface {
	Login(ctx context.Context, email string, password string) (token string, err error)
	RegisterNewUser(ctx context.Context, email string, username string, password string) (userID int64, err error)
	RegisterConfirm(ctx context.Context, email string, otp string) (success bool, message string, err error)
}

type serverAPI struct {
	authv1.UnimplementedAuthServer
	auth Auth
	v    *validator.Validate
}

func Register(gRPC *grpc.Server, auth Auth) {
	authv1.RegisterAuthServer(gRPC, &serverAPI{
		auth: auth,
		v:    validator.New(),
	})
}

func (s *serverAPI) Register(ctx context.Context, req *authv1.RegisterRequest) (*authv1.RegisterResponse, error) {
	registerRequest := structs.RegisterRequest{
		Email:    req.Email,
		Username: req.Username,
		Password: req.Password,
	}

	err := s.v.Struct(registerRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	userID, err := s.auth.RegisterNewUser(ctx, req.GetEmail(), req.GetUsername(), req.GetPassword())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrUserExists):
			return nil, status.Error(codes.AlreadyExists, "user already exists")
		default:
			return nil, status.Error(codes.Internal, "internal server error")
		}
	}

	return &authv1.RegisterResponse{
		UserID: userID,
	}, nil
}

func (s *serverAPI) RegisterConfirm(ctx context.Context, req *authv1.RegisterConfirmRequest) (*authv1.RegisterConfirmResponse, error) {
	registerConfirmRequest := structs.RegisterConfirmRequest{
		Email: req.Email,
		OTP:   req.Otp,
	}

	err := s.v.Struct(registerConfirmRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	success, message, err := s.auth.RegisterConfirm(ctx, req.GetEmail(), req.GetOtp())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrInvalidOTP):
			return nil, status.Error(codes.InvalidArgument, "Invalid OTP code")
			// TODO: error handling
		default:
			return nil, status.Error(codes.Internal, "internal server error")
		}
	}

	return &authv1.RegisterConfirmResponse{
		Message: message,
		Success: success,
	}, nil
}
