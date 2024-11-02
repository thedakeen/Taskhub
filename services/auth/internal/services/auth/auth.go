package auth

import (
	"auth/internal/domain/entities"
	"auth/internal/lib/jwt"
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
	tokenTTL     time.Duration
}

type UserSaver interface {
	SaveUser(ctx context.Context, email string, username string, passHash []byte) (userID int64, err error)
	ConfirmUser(ctx context.Context, email string, otp string) (success bool, message string, err error)
}

type UserProvider interface {
	GetUser(ctx context.Context, email string) (*entities.User, error)
}

//type AppProvider interface {
//	App(ctx context.Context, appID int) (entities.App, error)
//}

func New(
	log *slog.Logger,
	userSaver UserSaver,
	userProvider UserProvider,
	tokenTTL time.Duration) *Auth {
	return &Auth{
		userSaver:    userSaver,
		userProvider: userProvider,
		log:          log,
		tokenTTL:     tokenTTL,
	}
}

var (
	ErrInvalidCredentials = errors.New("invalid authentication credentials")
	ErrInvalidAppId       = errors.New("invalid app id")
	ErrUserExists         = errors.New("user already exists")
	ErrUsernameExists     = errors.New("username is already taken")
)

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
		switch {
		case errors.Is(err, storage.ErrUserExists):
			a.log.Warn("user already exists", sl.Err(err))
			return 0, fmt.Errorf("%s:%w", op, ErrUserExists)

		case errors.Is(err, storage.ErrUsernameExists):
			a.log.Warn("username is already taken", sl.Err(err))
			return 0, fmt.Errorf("%s:%w", op, ErrUsernameExists)

		default:
			a.log.Error("failed to save user", sl.Err(err))
			return 0, fmt.Errorf("%s:%w", op, err)
		}
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
		case errors.Is(err, storage.ErrInvalidOrExpiredOTP):
			a.log.Warn("invalid OTP")
			return false, "Invalid OTP", err
		default:
			a.log.Error("failed to confirm email", sl.Err(err))
			return false, "", err
		}
	}

	return success, message, nil

}

func (a *Auth) Login(ctx context.Context, email string, password string) (string, error) {
	const op = "auth.Login"

	log := a.log.With(
		slog.String("op", op),
		slog.String("email", email))

	log.Info("attempting to login user")

	user, err := a.userProvider.GetUser(ctx, email)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			a.log.Warn("user not found", sl.Err(err))
			return "", fmt.Errorf("%s:%w", op, ErrInvalidCredentials)

		default:
			a.log.Error("failed to get user", sl.Err(err))
			return "", fmt.Errorf("%s:%w", op, err)
		}
	}

	err = entities.Matches(user, password)
	if err != nil {
		a.log.Info("invalid credentials", sl.Err(err))

		return "", fmt.Errorf("%s:%w", op, ErrInvalidCredentials)
	}

	log.Info("logged in successfully")

	token, err := jwt.NewToken(*user, a.tokenTTL)
	if err != nil {
		a.log.Error("failed to generate token", sl.Err(err))

		return "", fmt.Errorf("%s:%w", op, err)
	}

	return token, nil
}
