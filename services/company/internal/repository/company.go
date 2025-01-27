package repository

import (
	"company/internal/domain/entities"
	"context"
	"database/sql"
)

type Storage struct {
	Db *sql.DB
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
