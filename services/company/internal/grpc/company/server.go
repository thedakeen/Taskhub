package company

import (
	companyv1 "company/gen/company"
	authgrpc "company/internal/clients/auth/grpc"
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
	VerifyCompanyRepresentative(ctx context.Context, userID int64, issueID int64) (bool, error)
}

type Issue interface {
	AddIssue(ctx context.Context, installationID int64, title string, body string) (int64, error)
	AllCompanyIssuesInfo(ctx context.Context, id int64) ([]*entities.Issue, error)
	IssueInfo(ctx context.Context, id int64, devID *int64) (*entities.Issue, error)

	AssignDeveloperToIssue(ctx context.Context, issueID, developerID int64) (int64, error)
	AddSolution(ctx context.Context, issueID, developerID int64, solution string) (int64, error)

	GetIssueSolutions(ctx context.Context, issueID int64) ([]*entities.Solution, error)
	GetIssueSolution(ctx context.Context, issueID, solutionID int64) (*entities.Solution, error)

	GetDeveloperSolutions(ctx context.Context, developerID int64) ([]*entities.Solution, error)
	GetDeveloperInProgressTasks(ctx context.Context, developerID int64) ([]*entities.Assignment, error)
}

type serverAPI struct {
	companyv1.UnimplementedCompanyServer
	company    Company
	issue      Issue
	authClient *authgrpc.Client
	v          *validator.Validate
}

//var (
//	cfg = config.MustLoad()
//)

func Register(gRPC *grpc.Server, company Company, issue Issue, authClient *authgrpc.Client) {
	companyv1.RegisterCompanyServer(gRPC, &serverAPI{
		company:    company,
		issue:      issue,
		authClient: authClient,
		v:          validator.New(),
	})
}

// ////////////// ISSUES ////////////////

func (s *serverAPI) CompanyIssues(ctx context.Context, req *companyv1.GetIssuesOfCompanyRequest) (*companyv1.GetIssuesOfCompanyResponse, error) {
	issuesRequest := structs.CompanyRequest{
		CompanyID: req.CompanyId,
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
			IssueId: i.ID,
			Title:   i.Title,
			Body:    i.Body,
		})
	}

	return &companyv1.GetIssuesOfCompanyResponse{
		Issues: issueResponses,
	}, nil
}

func (s *serverAPI) Issue(ctx context.Context, req *companyv1.GetIssueRequest) (*companyv1.GetIssueResponse, error) {
	issueRequest := structs.IssueRequest{
		IssueID: req.IssueId,
	}

	err := s.v.Struct(issueRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	tokenString, err := s.authenticate2(ctx)
	if err != nil {
		return nil, err
	}

	var developerIDPtr *int64
	if tokenString != "" {
		developerID, err := extractUserID(tokenString)
		if err != nil {
			return nil, err
		}
		if developerID != 0 {
			developerIDPtr = &developerID
		}
	}

	issue, err := s.issue.IssueInfo(ctx, req.GetIssueId(), developerIDPtr)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			return nil, status.Error(codes.Internal, err.Error())
		}
	}

	return &companyv1.GetIssueResponse{
		IssueId: issue.ID,
		Title:   issue.Title,
		Body:    issue.Body,

		AssignmentStatus: issue.AssignmentStatus.String,
		SolutionText:     issue.SolutionText.String,
		SolutionStatus:   issue.SolutionStatus.String,
	}, nil
}

func (s *serverAPI) AssignDeveloper(ctx context.Context, req *companyv1.AssignDeveloperRequest) (*companyv1.AssignDeveloperResponse, error) {
	assignDeveloperRequest := structs.AssignDeveloperRequest{
		IssueID: req.IssueId,
	}

	err := s.v.Struct(assignDeveloperRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	tokenString, err := s.authenticate(ctx)
	if err != nil {
		return nil, err
	}

	developerID, err := extractUserID(tokenString)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid token data")
	}

	isGithubLinked, err := s.authClient.IsGithubLinked(ctx, developerID)

	if !isGithubLinked {
		return nil, status.Error(codes.PermissionDenied, "link github account to solve tasks")
	}

	assignmentID, err := s.issue.AssignDeveloperToIssue(ctx, req.GetIssueId(), developerID)
	if err != nil {
		if errors.Is(err, storage.AlreadyExists) {
			return nil, status.Error(codes.AlreadyExists, "developer was already assigned")
		}
		return nil, status.Error(codes.Internal, "internal error")
	}

	return &companyv1.AssignDeveloperResponse{
		AssignmentId: assignmentID,
	}, nil

}

func (s *serverAPI) SubmitSolution(ctx context.Context, req *companyv1.SubmitSolutionRequest) (*companyv1.SubmitSolutionResponse, error) {
	submitSolutionRequest := structs.SubmitSolutionRequest{
		IssueID:  req.IssueId,
		Solution: req.SolutionText,
	}

	err := s.v.Struct(submitSolutionRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	tokenString, err := s.authenticate(ctx)
	if err != nil {
		return nil, err
	}

	developerID, err := extractUserID(tokenString)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid token data")
	}

	solutionID, err := s.issue.AddSolution(ctx, req.GetIssueId(), developerID, req.GetSolutionText())
	if err != nil {
		if errors.Is(err, storage.ErrNoRecordFound) {
			return nil, status.Error(codes.PermissionDenied, "solution has not been submitted")
		}
		if errors.Is(err, storage.AlreadyExists) {
			return nil, status.Error(codes.AlreadyExists, "solution already submitted")
		}
		return nil, status.Error(codes.Internal, "internal error")
	}

	return &companyv1.SubmitSolutionResponse{
		SolutionId: solutionID,
	}, nil

}

func (s *serverAPI) IssueSolutions(ctx context.Context, req *companyv1.GetSolutionsOfIssueRequest) (*companyv1.GetSolutionsOfIssueResponse, error) {
	issueSolutionsRequest := structs.IssueSolutionsRequest{
		IssueID: req.IssueId,
	}

	err := s.v.Struct(issueSolutionsRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	tokenString, err := s.authenticate(ctx)
	if err != nil {
		return nil, err
	}

	userID, err := extractUserID(tokenString)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid token data")
	}

	isRepresentative, err := s.company.VerifyCompanyRepresentative(ctx, userID, req.GetIssueId())
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to verify authorization")
	}

	if !isRepresentative {
		return nil, status.Error(codes.PermissionDenied, "permission denied")
	}

	solutions, err := s.issue.GetIssueSolutions(ctx, req.GetIssueId())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, "no solutions found")
		default:
			return nil, status.Error(codes.Internal, "failed to get solutions")
		}
	}

	var solutionResponses []*companyv1.GetIssueSolutionResponse
	for _, solution := range solutions {

		var rating int32
		if solution.Rating.Valid {
			rating = solution.Rating.Int32
		} else {
			rating = 0
		}

		solutionResponses = append(solutionResponses, &companyv1.GetIssueSolutionResponse{
			SolutionId:   solution.ID,
			AssignmentId: solution.AssignmentID,
			SolutionText: solution.SolutionText,
			Status:       solution.Status,
			Rating:       rating,
			AssignedAt:   timestamppb.New(solution.AssignedAt),
			CompletedAt:  timestamppb.New(solution.CompletedAt),
		})
	}

	return &companyv1.GetSolutionsOfIssueResponse{
		Solutions: solutionResponses,
	}, nil
}

func (s *serverAPI) IssueSolution(ctx context.Context, req *companyv1.GetIssueSolutionRequest) (*companyv1.GetIssueSolutionResponse, error) {
	issueSolutionRequest := structs.IssueSolutionRequest{
		IssueID:    req.IssueId,
		SolutionID: req.SolutionId,
	}

	err := s.v.Struct(issueSolutionRequest)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	tokenString, err := s.authenticate(ctx)
	if err != nil {
		return nil, err
	}

	userID, err := extractUserID(tokenString)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid token data")
	}

	isRepresentative, err := s.company.VerifyCompanyRepresentative(ctx, userID, req.GetIssueId())
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to verify authorization")
	}

	if !isRepresentative {
		return nil, status.Error(codes.PermissionDenied, "permission denied")
	}

	solution, err := s.issue.GetIssueSolution(ctx, req.GetIssueId(), req.GetSolutionId())
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, "solution not found")
		default:
			return nil, status.Error(codes.Internal, "failed to get solution")
		}
	}

	var rating int32
	if solution.Rating.Valid {
		rating = solution.Rating.Int32
	} else {
		rating = 0
	}

	return &companyv1.GetIssueSolutionResponse{
		SolutionId:   solution.ID,
		AssignmentId: solution.AssignmentID,
		SolutionText: solution.SolutionText,
		Status:       solution.Status,
		Rating:       rating,
		AssignedAt:   timestamppb.New(solution.AssignedAt),
		CompletedAt:  timestamppb.New(solution.CompletedAt),
	}, nil
}

func (s *serverAPI) DeveloperSolutions(ctx context.Context, req *companyv1.GetDeveloperSolutionsRequest) (*companyv1.GetDeveloperSolutionsResponse, error) {
	developerID := req.DeveloperId

	if developerID <= 0 {
		return nil, status.Error(codes.InvalidArgument, "invalid developer ID")
	}

	solutions, err := s.issue.GetDeveloperSolutions(ctx, developerID)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, "no solutions found")
		default:
			return nil, status.Error(codes.Internal, "failed to get solutions")
		}
	}

	var solutionResponses []*companyv1.GetIssueSolutionResponse
	for _, solution := range solutions {
		var rating int32
		if solution.Rating.Valid {
			rating = solution.Rating.Int32
		} else {
			rating = 0
		}

		solutionResponses = append(solutionResponses, &companyv1.GetIssueSolutionResponse{
			SolutionId:   solution.ID,
			AssignmentId: solution.AssignmentID,
			SolutionText: solution.SolutionText,
			Status:       solution.Status,
			Rating:       rating,
			AssignedAt:   timestamppb.New(solution.AssignedAt),
			CompletedAt:  timestamppb.New(solution.CompletedAt),
		})
	}

	return &companyv1.GetDeveloperSolutionsResponse{
		Solutions: solutionResponses,
	}, nil
}

func (s *serverAPI) DeveloperInProgressTasks(ctx context.Context, req *companyv1.GetDeveloperInProgressTasksRequest) (*companyv1.GetDeveloperInProgressTasksResponse, error) {
	developerID := req.DeveloperId

	if developerID <= 0 {
		return nil, status.Error(codes.InvalidArgument, "invalid developer ID")
	}

	assignments, err := s.issue.GetDeveloperInProgressTasks(ctx, developerID)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrNoRecordFound):
			return nil, status.Error(codes.NotFound, "no tasks in progress found")
		default:
			return nil, status.Error(codes.Internal, "failed to get tasks in progress")
		}
	}

	var taskResponses []*companyv1.GetDeveloperTaskResponse
	for _, assignment := range assignments {
		taskResponses = append(taskResponses, &companyv1.GetDeveloperTaskResponse{
			AssignmentId: assignment.ID,
			IssueId:      assignment.IssueID,
			Status:       assignment.Status,
			AssignedAt:   timestamppb.New(assignment.AssignedAt),
			IssueTitle:   assignment.IssueTitle,
			IssueBody:    assignment.IssueBody,
		})
	}

	return &companyv1.GetDeveloperInProgressTasksResponse{
		Tasks: taskResponses,
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
		CompanyID: req.CompanyId,
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
