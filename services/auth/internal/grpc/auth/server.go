package auth

import (
	authv1 "auth/gen/auth"
	"context"
	"github.com/go-playground/validator"
	"google.golang.org/grpc"
)

type Auth interface {
	Login(ctx context.Context, email string, password string) (token string, err error)
	RegisterNewUser(ctx context.Context, email string, name string, password string) (message string, err error)
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
