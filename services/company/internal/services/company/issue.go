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
	GetIssue(ctx context.Context, id int64, devID *int64) (*entities.Issue, error)
	GetAllCompanyIssues(ctx context.Context, id int64) ([]*entities.Issue, error)

	CreateAssignment(ctx context.Context, issueID, developerID int64) (int64, error)
	CreateSolution(ctx context.Context, assignmentID int64, solution string) (int64, error)
	GetAssignmentID(ctx context.Context, issueID, developerID int64) (int64, error)
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

func (c Company) IssueInfo(ctx context.Context, id int64, devID *int64) (*entities.Issue, error) {
	const op = "company.IssueInfo"

	log := c.log.With(
		slog.String("op", op),
	)

	log.Info("get information about issue")

	issue, err := c.issueProvider.GetIssue(ctx, id, devID)
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

func (c Company) AssignDeveloperToIssue(ctx context.Context, issueID, developerID int64) (int64, error) {
	const op = "company.AssignIssue"

	log := c.log.With(
		slog.String("op", op),
		slog.Int64("devID", developerID),
		slog.Int64("issueID", issueID),
	)

	log.Info("assigning developer to issue")

	issueID, err := c.issueProvider.CreateAssignment(ctx, issueID, developerID)
	if err != nil {
		switch {
		case errors.Is(err, storage.AlreadyExists):
			c.log.Warn("developer already assigned")
			return 0, fmt.Errorf("%s:%w", op, err)
		default:
			c.log.Error("developer has not been assigned")
			return 0, fmt.Errorf("%s:%w", op, err)
		}
	}

	log.Info("issue assigned successfully")

	return issueID, nil
}

func (c Company) AddSolution(ctx context.Context, issueID, developerID int64, solution string) (int64, error) {
	const op = "company.AddSolution"

	log := c.log.With(
		slog.String("op", op),
		slog.Int64("devID", developerID),
		slog.Int64("issueID", issueID),
	)

	log.Info("submitting task solution")

	assignmentID, err := c.issueProvider.GetAssignmentID(ctx, issueID, developerID)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			c.log.Warn("assignment not found")
			return 0, fmt.Errorf("%s:%w", op, err)
		default:
			c.log.Warn("assignment id has not been fetched")
			return 0, fmt.Errorf("%s:%w", op, err)
		}
	}

	solutionID, err := c.issueProvider.CreateSolution(ctx, assignmentID, solution)
	if err != nil {
		switch {
		case errors.Is(err, storage.AlreadyExists):
			c.log.Warn("solution already submitted")
			return 0, fmt.Errorf("%s:%w", op, err)
		default:
			c.log.Warn("solution has not been submitted")
			return 0, fmt.Errorf("%s:%w", op, err)
		}
	}

	log.Info("solution submitted successfully")

	return solutionID, nil
}

//////////////// END OF ISSUES ////////////////
