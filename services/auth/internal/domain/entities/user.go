package entities

import "time"

type User struct {
	ID             int64
	Email          string
	Username       string
	HashedPassword []byte
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type OTP struct {
	Code string
}
