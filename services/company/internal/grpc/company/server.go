package company

import (
	companyv1 "company/gen/company"
	"company/internal/config"
	"company/internal/domain/entities"
	"company/internal/grpc/structs"
	"context"
	"github.com/go-playground/validator"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Company interface {
	AddCompany(ctx context.Context, installationID int64, companyName string, companyLogo string) (companyID int64, err error)
	CompanyGithubIntegration(ctx context.Context, id int64) (companyName string, installationID int64, err error)
	CompanyInfo(ctx context.Context, id int64) (*entities.Company, error)
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

func (s *serverAPI) Company(ctx context.Context, req *companyv1.GetCompanyRequest) (*companyv1.GetCompanyResponse, error) {
	companyRequest := structs.CompanyRequest{
		CompanyID: 1,
	}

	err := s.v.Struct(companyRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	return &companyv1.GetCompanyResponse{
		CompanyName: "Google",
		Description: "Very large company",
		WebsiteUrl:  "google.com",
		Logo:        "googol",
	}, nil
}

func (s *serverAPI) AddCompany(ctx context.Context, req *companyv1.AddCompanyGithubIntegrationRequest) (*companyv1.AddCompanyGithubIntegrationResponse, error) {
	companyID, err := s.company.AddCompany(ctx, req.InstallationId, req.CompanyName, req.LogoUrl)
	if err != nil {
		switch {
		default:
			return nil, status.Error(codes.Internal, "internal server error")
		}
	}

	return &companyv1.AddCompanyGithubIntegrationResponse{
		CompanyId: companyID,
	}, nil
}
