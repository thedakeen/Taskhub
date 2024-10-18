package config

import (
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
	"time"
)

type Config struct {
	Env            string        `env:"ENV" env-default:"dev"`
	PostgresURI    string        `env:"POSTGRES_URI" env-required:"true"`
	TokenTTL       time.Duration `env:"TOKEN_TTL" env-required:"true"`
	ServicePort    int           `env:"AUTH_SERVICE_PORT"`
	ServiceTimeout time.Duration `env:"AUTH_SERVICE_TIMEOUT"`
}

func MustLoad() *Config {
	err := godotenv.Load()
	if err != nil {
		panic("No .env file found")
	}

	var cfg Config

	err = cleanenv.ReadEnv(&cfg)
	if err != nil {
		panic("failed to read config " + err.Error())
	}

	return &cfg
}
