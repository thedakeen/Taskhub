package structs

type CompanyRequest struct {
	CompanyID int64 `validate:"required,min=0"`
}

type CompanyIntegrationRequest struct {
	CompanyID int64 `validate:"required,min=0"`
}

type IssueRequest struct {
	IssueID int64 `validate:"required,min=0"`
}
