package http

import (
	companyv1 "company/gen/company"
	"company/internal/app/http/webhook"
	"context"
	"errors"
	"fmt"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/rs/cors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log/slog"
	"net"
	"net/http"
	"strconv"
)

type App struct {
	log            *slog.Logger
	httpPort       int
	grpcPort       int
	server         *http.Server
	webhookHandler *webhook.Handler
}

func New(log *slog.Logger, httpPort int, grpcPort int, webhookHandler *webhook.Handler) *App {
	return &App{
		log:            log,
		httpPort:       httpPort,
		grpcPort:       grpcPort,
		webhookHandler: webhookHandler,
	}
}

func (app *App) MustRun(ctx context.Context) {
	err := app.Run(ctx)
	if err != nil {
		panic(err)
	}
}

func (app *App) Run(ctx context.Context) error {
	const op = "http.Run"

	log := app.log.With(
		slog.String("op", op),
		slog.Int("port", app.httpPort),
	)

	mux := runtime.NewServeMux()

	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	}

	l, err := net.Listen("tcp", fmt.Sprintf(":%d", app.httpPort))
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	grpcAddress := net.JoinHostPort("localhost", strconv.Itoa(app.grpcPort))
	err = companyv1.RegisterCompanyHandlerFromEndpoint(ctx, mux, grpcAddress, opts)
	if err != nil {
		return fmt.Errorf("%s:%w", op, err)
	}

	httpMux := http.NewServeMux()
	httpMux.Handle("/", mux)
	httpMux.HandleFunc("/v1/webhooks", app.webhookHandler.HandleWebhook)

	corsMux := app.setupCORS().Handler(httpMux)

	app.server = &http.Server{
		Addr:    l.Addr().String(),
		Handler: corsMux,
	}

	log.Info("HTTP server is running", slog.String("addr", l.Addr().String()))

	go func() {
		if err := app.server.Serve(l); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("HTTP server failed", slog.String("error", err.Error()))
		}
	}()

	return nil

}

func (app *App) GracefulStop(ctx context.Context) error {
	const op = "http.GracefulStop"

	err := app.server.Shutdown(ctx)
	if err != nil {
		return fmt.Errorf("%s: failed to shutdown server: %w", op, err)
	}

	return nil
}

func (app *App) Stop(ctx context.Context) {
	const op = "http.Stop"

	log := app.log.With(slog.String("op", op))
	log.Info("stopping HTTP server", slog.Int("port", app.httpPort))

	err := app.GracefulStop(ctx)
	if err != nil {
		log.Error("failed to stop HTTP server")
	}

}

func (app *App) setupCORS() *cors.Cors {
	return cors.New(cors.Options{
    AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		Debug:            true,
	})
}
