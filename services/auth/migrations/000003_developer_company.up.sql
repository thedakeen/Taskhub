CREATE TABLE companies (
                           company_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                           company_name VARCHAR(255) NOT NULL,
                           description TEXT,
                           website VARCHAR(255),
                           logo VARCHAR(255)
);

CREATE TABLE developers (
                            developer_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                            github_id BIGINT UNIQUE,
                            bio TEXT,
                            github_username VARCHAR(255),
                            avatar_url VARCHAR(255),
                            cv_url VARCHAR(255)
);