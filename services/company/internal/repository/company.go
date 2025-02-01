package repository

import (
	"company/internal/domain/entities"
	"context"
	"database/sql"
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

func (s Storage) GetGithubIntegration(ctx context.Context, id int64) (string, int64, error) {
	const op = "repository.company.CompanyIntegration"

	//query, err := s.Db.Prepare("SELECT company_name, installation_id FROM companies WHERE company_id = $1")

	return "", 0, nil

}

func (s Storage) GetCompany(ctx context.Context, id int64) (*entities.Company, error) {
	//TODO implement me
	panic("implement me")
}
