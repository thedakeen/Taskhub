package company

import (
	"company/internal/domain/entities"
	"company/internal/storage"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"
)

type Company struct {
	log          *slog.Logger
	compProvider CompanyProvider
	tokenTTL     time.Duration
}

type CompanyProvider interface {
	GetGithubIntegration(ctx context.Context, id int64) (string, int64, error)
	GetCompany(ctx context.Context, id int64) (*entities.Company, error)
}

func New(
	log *slog.Logger,
	compProvider CompanyProvider,
	tokenTTL time.Duration) *Company {
	return &Company{
		compProvider: compProvider,
		log:          log,
		tokenTTL:     tokenTTL,
	}
}

func (c Company) CompanyGithubIntegration(ctx context.Context, id int64) (string, int64, error) {
	const op = "company.CompanyIntegration"

	log := c.log.With(
		slog.String("op", op),
		slog.Int64("id", id),
	)

	log.Info("getting information about company")

	companyName, installationID, err := c.compProvider.GetGithubIntegration(ctx, id)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			c.log.Warn("no company found", slog.String("error", err.Error()))
			return "", 0, fmt.Errorf("%s:%w", op, err)
		default:
			c.log.Warn("failed to get company integrations", slog.String("error", err.Error()))
			return "", 0, fmt.Errorf("%s:%w", op, err)
		}
	}

	log.Info("integration type got successfully")

	return companyName, installationID, nil

}

func (c Company) CompanyInfo(ctx context.Context, id int64) (*entities.Company, error) {
	return &entities.Company{}, nil
}
