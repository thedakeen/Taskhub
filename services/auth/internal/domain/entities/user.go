package entities

import (
	"golang.org/x/crypto/bcrypt"
	"time"
)

type User struct {
	ID             int64
	Email          string
	Username       string
	HashedPassword []byte
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func Matches(user *User, password string) error {
	err := bcrypt.CompareHashAndPassword(user.HashedPassword, []byte(password))

	if err != nil {
		return err
	}

	return nil
}

type OTP struct {
	Code string
}
