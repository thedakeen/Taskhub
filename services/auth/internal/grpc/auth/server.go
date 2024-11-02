package auth

import (
	authv1 "auth/gen/auth"
	"auth/internal/grpc/structs"
	"auth/internal/services/auth"
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
		case errors.Is(err, auth.ErrUserExists):
			return nil, status.Error(codes.AlreadyExists, "email address is already exists")
		case errors.Is(err, auth.ErrUsernameExists):
			return nil, status.Errorf(codes.AlreadyExists, "username is already taken")
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
		case errors.Is(err, storage.ErrInvalidOrExpiredOTP):
			return nil, status.Error(codes.InvalidArgument, "Invalid OTP code")
		default:
			return nil, status.Error(codes.Internal, "internal server error")
		}
	}

	return &authv1.RegisterConfirmResponse{
		Message: message,
		Success: success,
	}, nil
}

func (s *serverAPI) Login(ctx context.Context, req *authv1.LoginRequest) (*authv1.LoginResponse, error) {
	loginRequest := structs.LoginRequest{
		Email:    req.Email,
		Password: req.Password,
	}

	err := s.v.Struct(loginRequest)

	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	token, err := s.auth.Login(ctx, req.GetEmail(), req.GetPassword())
	if err != nil {
		switch {
		case errors.Is(err, auth.ErrInvalidCredentials):
			return nil, status.Error(codes.InvalidArgument, "invalid email or password")
		default:
			return nil, status.Error(codes.Internal, "failed to log in")
		}
	}

	return &authv1.LoginResponse{
		Token: token,
	}, nil
}
