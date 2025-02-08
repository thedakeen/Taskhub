package company

import (
	companyv1 "company/gen/company"
	"company/internal/config"
	"company/internal/domain/entities"
	"company/internal/grpc/structs"
	"company/internal/storage"
	"context"
	"errors"
	"github.com/go-playground/validator"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Company interface {
	AddCompany(ctx context.Context, installationID int64, companyName string, companyLogo string) (companyID int64, err error)
	CompanyGithubIntegration(ctx context.Context, id int64) (installationID int64, err error)
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

	company, err := s.company.CompanyInfo(ctx, req.GetCompanyID())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &companyv1.GetCompanyResponse{
		CompanyName: company.CompanyName,
		Description: company.Description.String,
		WebsiteUrl:  company.WebsiteURL.String,
		Logo:        company.LogoURL,
	}, nil
}

func (s *serverAPI) CompanyGithubIntegration(ctx context.Context, req *companyv1.GetCompanyGithubIntegrationRequest) (*companyv1.GetCompanyGithubIntegrationResponse, error) {
	companyIntegrationRequest := structs.CompanyIntegrationRequest{
		CompanyID: req.CompanyId,
	}

	err := s.v.Struct(companyIntegrationRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	installationID, err := s.company.CompanyGithubIntegration(ctx, req.GetCompanyId())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &companyv1.GetCompanyGithubIntegrationResponse{InstallationId: installationID}, nil

}
