package repository

import (
	"company/internal/domain/entities"
	"company/internal/storage"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

type Storage struct {
	Db *sql.DB
}

func (s Storage) AddGithubIntegration(ctx context.Context, installationID int64, companyName string, logoURL string) (int64, error) {
	const op = "repository.company.AddGithubIntegration"

	var id int64

	query := `INSERT INTO companies (installation_id, company_name, logo) VALUES ($1, $2, $3) RETURNING company_id`

	args := []any{installationID, companyName, logoURL}
	err := s.Db.QueryRowContext(ctx, query, args...).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("%s:%w", op, err)
	}

	return id, nil
}

func (s Storage) GetGithubIntegration(ctx context.Context, id int64) (installationID int64, err error) {
	const op = "repository.company.CompanyIntegration"

	query, err := s.Db.Prepare("SELECT installation_id FROM companies WHERE company_id = $1")
	if err != nil {
		return 0, fmt.Errorf("%s:%w", op, err)
	}

	err = query.QueryRowContext(ctx, id).Scan(&installationID)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return 0, storage.ErrNoRecordFound
		default:
			return 0, fmt.Errorf("%s:%w", op, err)
		}
	}

	return installationID, nil

}

func (s Storage) GetCompany(ctx context.Context, id int64) (*entities.Company, error) {
	const op = "repository.company.GetCompany"

	query, err := s.Db.Prepare("SELECT company_name, description, website, logo FROM companies WHERE company_id = $1")
	if err != nil {
		return nil, fmt.Errorf("%s:%w", op, err)
	}

	var company entities.Company

	err = query.QueryRowContext(ctx, id).Scan(
		&company.CompanyName,
		&company.Description,
		&company.WebsiteURL,
		&company.LogoURL)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, storage.ErrNoRecordFound
		default:
			return nil, fmt.Errorf("%s:%w", op, err)
		}
	}

	return &company, nil
}
