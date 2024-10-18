package auth

import (
	"auth/internal/domain/entities"
	"auth/internal/lib/logger/sl"
	"auth/internal/storage"
	"context"
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"log/slog"
	"time"
)

type Auth struct {
	log          *slog.Logger
	userSaver    UserSaver
	userProvider UserProvider
	appProvider  AppProvider
	tokenTTL     time.Duration
}

type UserSaver interface {
	SaveUser(ctx context.Context, email string, name string, passHash []byte) (userID int64, err error)
	ConfirmUser(ctx context.Context, email string, otp string) (success bool, message string, err error)
}

type UserProvider interface {
	GetUser(ctx context.Context, email string) (entities.User, error)
}

type AppProvider interface {
	App(ctx context.Context, appID int) (entities.App, error)
}

func New(
	log *slog.Logger,
	userSaver UserSaver,
	userProvider UserProvider,
	appProvider AppProvider,
	tokenTTL time.Duration) *Auth {
	return &Auth{
		userSaver:    userSaver,
		userProvider: userProvider,
		log:          log,
		appProvider:  appProvider,
		tokenTTL:     tokenTTL,
	}
}

func (a *Auth) RegisterNewUser(ctx context.Context, email string, username string, password string) (int64, error) {
	const op = "auth.RegisterNewUser"

	log := a.log.With(
		slog.String("op", op),
		slog.String("email", email),
	)

	log.Info("registering user")

	passHash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		log.Error("failed to generate password hash", sl.Err(err))

		return 0, fmt.Errorf("%s:%w", op, err)

	}

	id, err := a.userSaver.SaveUser(ctx, email, username, passHash)
	if err != nil {
		log.Error("failed to save user", sl.Err(err))
		return 0, fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}

func (a *Auth) RegisterConfirm(ctx context.Context, email string, otp string) (bool, string, error) {
	const op = "auth.RegisterConfirm"

	log := a.log.With(
		slog.String("op", op),
		slog.String("email", email),
	)

	log.Info("confirming email")

	success, message, err := a.userSaver.ConfirmUser(ctx, email, otp)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrInvalidOTP):
			log.Warn("invalid OTP")
			return false, "Invalid OTP", err
		default:
			a.log.Error("failed to confirm email", sl.Err(err))
			return false, "", err
		}
	}

	return success, message, nil

}

func (a *Auth) Login(ctx context.Context, email string, password string) (string, error) {
	return "", nil
}
