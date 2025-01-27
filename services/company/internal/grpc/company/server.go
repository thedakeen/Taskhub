package company

import (
	companyv1 "company/gen/company"
	"company/internal/config"
	"context"
	"github.com/go-playground/validator"
	"google.golang.org/grpc"
)

type Company interface {
	CompanyGithubIntegration(ctx context.Context, id int64) (companyName string, installationID int64, err error)
}

type serverAPI struct {
	companyv1.UnimplementedCompanyServer
	company Company
	v       *validator.Validate
}

var (
	cfg = config.MustLoad()
)

func Register(gRPC *grpc.Server, company Company) {
	companyv1.RegisterCompanyServer(gRPC, &serverAPI{
		company: company,
		v:       validator.New(),
	})
}
