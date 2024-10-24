package repository

import (
	"auth/internal/domain/entities"
	"auth/internal/storage"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/lib/pq"
)

type Storage struct {
	Db *sql.DB
}

func (s *Storage) App(ctx context.Context, appID int) (entities.App, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Storage) GetUser(ctx context.Context, email string) (entities.User, error) {
	//TODO implement me
	panic("implement me")
}

func (s *Storage) SaveUser(ctx context.Context, email string, username string, passHash []byte) (int64, error) {
	const op = "repository.user.SaveUser"

	// TODO : выдача ОТП

	var id int64
	query := "INSERT INTO users (email, username, password_hash, activated) VALUES ($1, $2, $3, $4) RETURNING id"
	err := s.Db.QueryRowContext(ctx, query, email, username, passHash, false).Scan(&id)
	if err != nil {
		var pqErr *pq.Error
		switch {
		case errors.As(err, &pqErr) && pqErr.Code == "23505":
			return 0, fmt.Errorf("%s:%w", op, storage.ErrUserExists)
		default:
			return 0, fmt.Errorf("%s: %w", op, err)
		}
	}

	return id, nil
}

func (s *Storage) ConfirmUser(ctx context.Context, email string, otp string) (success bool, message string, err error) {
	panic("implement me")
}
