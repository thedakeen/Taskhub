package company

import (
	"company/internal/domain/entities"
	"company/internal/storage"
	"context"
	"errors"
	"fmt"
	"log/slog"
)

type IssueProvider interface {
	CreateIssue(ctx context.Context, installationID int64, title string, body string) (int64, error)
	GetIssue(ctx context.Context, id int64) (*entities.Issue, error)
	GetAllCompanyIssues(ctx context.Context, id int64) ([]*entities.Issue, error)
}

//////////////// ISSUES ////////////////

func (c Company) AllCompanyIssuesInfo(ctx context.Context, id int64) ([]*entities.Issue, error) {
	const op = "company.AllCompanyIssuesInfo"

	log := c.log.With(
		slog.String("op", op),
	)

	log.Info("get all issues of company")

	issues, err := c.issueProvider.GetAllCompanyIssues(ctx, id)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			c.log.Warn("no issues found", slog.String("error", err.Error()))
			return nil, fmt.Errorf("%s:%w", op, err)
		default:
			c.log.Warn("failed to get issues", slog.String("error", err.Error()))
			return nil, fmt.Errorf("%s:%w", op, err)
		}
	}

	log.Info("issues of company got successfully")

	return issues, nil
}

func (c Company) IssueInfo(ctx context.Context, id int64) (*entities.Issue, error) {
	const op = "company.IssueInfo"

	log := c.log.With(
		slog.String("op", op),
	)

	log.Info("get information about issue")

	issue, err := c.issueProvider.GetIssue(ctx, id)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			c.log.Warn("no issue found", slog.String("error", err.Error()))
			return nil, fmt.Errorf("%s:%w", op, err)
		default:
			c.log.Warn("failed to get issue information", slog.String("error", err.Error()))
			return nil, fmt.Errorf("%s:%w", op, err)
		}
	}

	log.Info("issue information got successfully")

	return issue, nil

}

func (c Company) AddIssue(ctx context.Context, installationID int64, title string, body string) (int64, error) {
	const op = "company.AddIssue"

	log := c.log.With(
		slog.String("op", op),
	)

	log.Info("catching information via webhook")

	issueID, err := c.issueProvider.CreateIssue(ctx, installationID, title, body)
	if err != nil {
		c.log.Error("issue has not been added")
		return 0, fmt.Errorf("%s:%w", op, err)
	}

	log.Info("issue integrated successfully via github")

	return issueID, nil
}

//////////////// END OF ISSUES ////////////////
