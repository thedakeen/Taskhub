package entities

import "database/sql"

type Company struct {
	ID          int64
	CompanyName string
	Description sql.NullString
	WebsiteURL  sql.NullString
	LogoURL     string
}
