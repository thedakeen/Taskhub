package entities

import (
	"database/sql"
	"time"
)

type Solution struct {
	ID           int64
	AssignmentID int64
	SolutionText string
	Status       string
	Rating       sql.NullInt32

	AssignedAt  time.Time
	CompletedAt time.Time
}
