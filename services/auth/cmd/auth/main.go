package main

import (
	"auth/internal/app"
	"auth/internal/config"
	"auth/internal/lib/logger/handlers/slogpretty"
	"context"
	"github.com/robfig/cron/v3"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
)

const (
	envLocal = "local"
	envDev   = "dev"
	envProd  = "prod"
)

var (
	cfg = config.MustLoad()
)

func main() {

	log := setupLogger(cfg.Env)

	log.Info("starting application",
		slog.String("env", cfg.Env),
		slog.Any("cfg", cfg),
		slog.Int("port", cfg.ServicePort),
	)

	application := app.New(log, cfg.ServicePort, cfg.PostgresURI, cfg.TokenTTL)

	go application.GRPCSrv.MustRun()

	go func() {
		c := cron.New()
		defer c.Stop()

		_, err := c.AddFunc("@every 24h", func() {
			err := application.Storage.DeleteInactiveUsers(context.Background())
			if err != nil {
				log.Error("error deleting inactive users", slog.String("error", err.Error()))
			} else {
				log.Info("unconfirmed users deleted successfully")
			}
		})
		if err != nil {
			log.Error("Failed to add cron job", slog.String("error", err.Error()))
		}

		c.Start()
		select {}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)

	s := <-quit

	log.Info("stopping application", slog.String("signal", s.String()))

	application.GRPCSrv.Stop()

	log.Info("application stopped")

}

func setupLogger(env string) *slog.Logger {
	var log *slog.Logger

	switch env {
	case envLocal:
		log = setupPrettySlog()
	case envDev:
		log = slog.New(
			slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}),
		)
	case envProd:
		log = slog.New(
			slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}),
		)
	}

	return log
}

func setupPrettySlog() *slog.Logger {
	opts := slogpretty.PrettyHandlerOptions{
		SlogOpts: &slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}

	handler := opts.NewPrettyHandler(os.Stdout)

	return slog.New(handler)
}
