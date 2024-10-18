package storage

import "errors"

var (
	ErrUserExists    = errors.New("email already in use")
	ErrNoRecordFound = errors.New("no record found")
	ErrAppNotFound   = errors.New("app not found")
	ErrInvalidOTP    = errors.New("invalid confirmation code")
)
