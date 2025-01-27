package structs

type CompanyRequest struct {
	CompanyID int64 `validate:"required,min=0"`
}
