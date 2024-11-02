package jwt

import (
	"auth/internal/config"
	"auth/internal/domain/entities"
	"github.com/golang-jwt/jwt"
	"time"
)

func NewToken(user entities.User, duration time.Duration) (string, error) {
	cfg := config.MustLoad()

	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["uid"] = user.ID
	claims["exp"] = time.Now().Add(duration).Unix()

	tokenString, err := token.SignedString([]byte(cfg.JwtSignedString))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
