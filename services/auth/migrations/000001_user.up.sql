CREATE TABLE users(
                          id BIGSERIAL PRIMARY KEY,
                          username text NOT NULL,
                          email citext UNIQUE NOT NULL,
                          created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
                          updated_at TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
                          password_hash bytea NOT NULL,
                          activated bool NOT NULL
                  );