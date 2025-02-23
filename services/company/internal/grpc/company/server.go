package company

import (
	companyv1 "company/gen/company"
	"company/internal/domain/entities"
	"company/internal/grpc/structs"
	"company/internal/storage"
	"context"
	"errors"
	"github.com/go-playground/validator"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Company interface {
	AddCompany(ctx context.Context, installationID int64, companyName string, companyLogo string) (companyID int64, err error)
	CompanyGithubIntegration(ctx context.Context, id int64) (installationID int64, err error)
	CompanyInfo(ctx context.Context, id int64) (*entities.Company, error)
	AllCompaniesInfo(ctx context.Context) ([]*entities.Company, error)
}

type Issue interface {
	AddIssue(ctx context.Context, installationID int64, title string, body string) (int64, error)
	AllCompanyIssuesInfo(ctx context.Context, id int64) ([]*entities.Issue, error)
	IssueInfo(ctx context.Context, id int64) (*entities.Issue, error)
}

type serverAPI struct {
	companyv1.UnimplementedCompanyServer
	company Company
	issue   Issue
	v       *validator.Validate
}

//var (
//	cfg = config.MustLoad()
//)

func Register(gRPC *grpc.Server, company Company, issue Issue) {
	companyv1.RegisterCompanyServer(gRPC, &serverAPI{
		company: company,
		issue:   issue,
		v:       validator.New(),
	})
}

// ////////////// ISSUES ////////////////

func (s *serverAPI) CompanyIssues(ctx context.Context, req *companyv1.GetIssuesOfCompanyRequest) (*companyv1.GetIssuesOfCompanyResponse, error) {
	issuesRequest := structs.CompanyRequest{
		CompanyID: 1,
	}

	err := s.v.Struct(issuesRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	issues, err := s.issue.AllCompanyIssuesInfo(ctx, req.GetCompanyId())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	var issueResponses []*companyv1.GetIssueResponse
	for _, i := range issues {
		issueResponses = append(issueResponses, &companyv1.GetIssueResponse{
			Title: i.Title,
			Body:  i.Body,
		})
	}

	return &companyv1.GetIssuesOfCompanyResponse{
		Issues: issueResponses,
	}, nil
}

func (s *serverAPI) Issue(ctx context.Context, req *companyv1.GetIssueRequest) (*companyv1.GetIssueResponse, error) {
	issueRequest := structs.IssueRequest{
		IssueID: 1,
	}

	err := s.v.Struct(issueRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	issue, err := s.issue.IssueInfo(ctx, req.GetIssueId())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &companyv1.GetIssueResponse{
		Title: issue.Title,
		Body:  issue.Body,
	}, nil
}

//////////////// END OF ISSUES ////////////////

func (s *serverAPI) Companies(ctx context.Context, req *companyv1.GetCompaniesRequest) (*companyv1.GetCompaniesResponse, error) {
	companies, err := s.company.AllCompaniesInfo(ctx)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	var companyResponses []*companyv1.Companies
	for _, c := range companies {
		companyResponses = append(companyResponses, &companyv1.Companies{
			CompanyId:   c.ID,
			CompanyName: c.CompanyName,
			Logo:        c.LogoURL,
		})
	}

	return &companyv1.GetCompaniesResponse{
		Companies: companyResponses,
	}, nil
}

func (s *serverAPI) Company(ctx context.Context, req *companyv1.GetCompanyRequest) (*companyv1.GetCompanyResponse, error) {
	companyRequest := structs.CompanyRequest{
		CompanyID: 1,
	}

	err := s.v.Struct(companyRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	company, err := s.company.CompanyInfo(ctx, req.GetCompanyId())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &companyv1.GetCompanyResponse{
		CompanyId:   company.ID,
		CompanyName: company.CompanyName,
		Description: company.Description.String,
		WebsiteUrl:  company.WebsiteURL.String,
		Logo:        company.LogoURL,
		CreatedAt:   timestamppb.New(company.CreatedAt),
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
