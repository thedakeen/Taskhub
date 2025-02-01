package app

import (
	grpcapp "company/internal/app/grpc"
	"company/internal/app/http"
	"company/internal/app/http/webhook"
	"company/internal/repository"
	"company/internal/services/company"
	"company/internal/storage/postgres"
	"log/slog"
	"time"
)

type App struct {
	GRPCSrv *grpcapp.App
	HTTPSrv *http.App
	Storage *repository.Storage
}

func New(log *slog.Logger, grpcPort int, httpPort int, storagePath string, tokenTTL time.Duration, webhookSecret string) *App {

	storage, err := postgres.New(storagePath)

	if err != nil {
		panic(err)
	}

	companyService := company.New(log, storage, tokenTTL)
	grpcApp := grpcapp.New(log, companyService, grpcPort)

	webhookHandler := webhook.NewHandler(log, companyService, webhookSecret)

	httpApp := http.New(log, httpPort, grpcPort, webhookHandler)

	return &App{
		GRPCSrv: grpcApp,
		HTTPSrv: httpApp,
		Storage: storage,
	}
}
