package repository

import (
	"company/internal/domain/entities"
	"company/internal/storage"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/lib/pq"
)

func (s Storage) CreateIssue(ctx context.Context, installationID int64, title string, body string) (int64, error) {
	const op = "repository.issue.AddIssue"

	var id int64

	query := `INSERT INTO issues (installation_id, title, body) VALUES ($1, $2, $3) RETURNING id`

	args := []any{installationID, title, body}
	err := s.Db.QueryRowContext(ctx, query, args...).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("%s:%w", op, err)
	}

	return id, nil
}

func (s Storage) GetIssue(ctx context.Context, id int64) (*entities.Issue, error) {
	const op = "repository.issue.GetIssue"

	query, err := s.Db.Prepare("SELECT id, title, body FROM issues WHERE id = $1")
	if err != nil {
		return nil, fmt.Errorf("%s:%w", op, err)
	}

	var issue entities.Issue

	err = query.QueryRowContext(ctx, id).Scan(
		&issue.ID,
		&issue.Title,
		&issue.Body)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, storage.ErrNoRecordFound
		default:
			return nil, fmt.Errorf("%s:%w", op, err)
		}
	}

	return &issue, nil
}

func (s Storage) GetAllCompanyIssues(ctx context.Context, id int64) ([]*entities.Issue, error) {
	const op = "repository.issue.GetAllIssues"

	query := "SELECT i.id, i.title, i.body FROM issues i INNER JOIN companies c ON i.installation_id = c.installation_id WHERE c.company_id = $1"

	rows, err := s.Db.QueryContext(ctx, query, id)
	if err != nil {
		return nil, fmt.Errorf("%s:%w", op, err)
	}

	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	//totalRecords := 0
	var issues []*entities.Issue

	for rows.Next() {
		issue := &entities.Issue{}

		err := rows.Scan(
			&issue.ID,
			&issue.Title,
			&issue.Body,
		)

		if err != nil {
			return nil, fmt.Errorf("%s:%w", op, err)
		}

		issues = append(issues, issue)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("%s:%w", op, err)
	}

	//if totalRecords == 0 {
	//	return nil, storage.ErrNoRecordFound
	//}

	return issues, nil
}

func (s Storage) CreateAssignment(ctx context.Context, issueID, developerID int64) (int64, error) {
	const op = "repository.issue.CreateAssignment"

	var id int64

	query := `INSERT INTO issue_assignments (issue_id, developer_id) VALUES ($1, $2) RETURNING assignment_id`

	args := []any{issueID, developerID}
	err := s.Db.QueryRowContext(ctx, query, args...).Scan(&id)
	if err != nil {
		var pqErr *pq.Error
		switch {
		case errors.As(err, &pqErr) && pqErr.Code == "23505":
			return 0, storage.AlreadyExists

		default:
			return 0, fmt.Errorf("%s:%w", op, err)
		}
	}

	return id, nil
}
