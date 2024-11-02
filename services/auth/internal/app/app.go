package app

import (
	grpcapp "auth/internal/app/grpc"
	"auth/internal/repository"
	"auth/internal/services/auth"
	"auth/internal/storage/postgres"
	"log/slog"
	"time"
)

type App struct {
	GRPCSrv *grpcapp.App
	Storage *repository.Storage
}

func New(log *slog.Logger, grpcPort int, storagePath string, tokenTTL time.Duration) *App {

	storage, err := postgres.New(storagePath)

	if err != nil {
		panic(err)
	}

	authService := auth.New(log, storage, storage, tokenTTL)
	grpcApp := grpcapp.New(log, authService, grpcPort)

	return &App{
		GRPCSrv: grpcApp,
		Storage: storage,
	}
}
