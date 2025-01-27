package config

import (
	"github.com/ilyakaznacheev/cleanenv"
	"sync"
	"time"
)

type Config struct {
	Env         string `env:"ENV" env-default:"dev"`
	PostgresURI string `env:"POSTGRES_URI" env-required:"true"`

	TokenTTL time.Duration `env:"TOKEN_TTL" env-required:"true"`

	ServicePort int `env:"COMPANY_SERVICE_PORT"`
	HttpPort    int `env:"HTTP_SERVICE_PORT"`

	ServiceTimeout time.Duration `env:"COMPANY_SERVICE_TIMEOUT"`
}

var (
	cfg  *Config
	once sync.Once
)

func MustLoad() *Config {
	once.Do(func() {
		cfg = &Config{}
		err := cleanenv.ReadEnv(cfg)
		if err != nil {
			panic("failed to read config " + err.Error())
		}
	})

	return cfg
}
