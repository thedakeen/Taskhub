CREATE TABLE otps (
                      id BIGSERIAL PRIMARY KEY,
                      email citext NOT NULL,
                      otp_code text NOT NULL,
                      created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
                      expires_at TIMESTAMP(0) WITH TIME ZONE NOT NULL,
                      FOREIGN KEY (email) REFERENCES users (email) ON DELETE CASCADE
);
