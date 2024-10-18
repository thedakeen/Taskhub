package structs

type RegisterRequest struct {
	Email    string `validate:"required,email"`
	Password string `validate:"required,min=8,max=32"`
	Username string `validate:"required,min=2,max=16"`
}

type RegisterConfirmRequest struct {
	Email string `validate:"required,email"`
	OTP   string `validate:"required,min=6,max=6"`
}
