package entities

import (
	"database/sql"
	"time"
)

type Assignment struct {
	ID          int64
	IssueID     int64
	DeveloperID int64
	Status      string
	AssignedAt  time.Time
	CompletedAt sql.NullTime
	IssueTitle  string
	IssueBody   string
}
