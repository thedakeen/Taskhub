package app

import (
	grpcapp "auth/internal/app/grpc"
	"log/slog"
	"time"
)

type App struct {
	GRPCSrv *grpcapp.App
}

func New(log *slog.Logger, grpcPort int, storagePath string, tokenTTL time.Duration) *App {

	//authService := auth.New()
	grpcApp := grpcapp.New(log, nil, grpcPort)

	return &App{
		GRPCSrv: grpcApp,
	}
}
