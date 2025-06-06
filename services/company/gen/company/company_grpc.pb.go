// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             v5.26.1
// source: company.proto

package compv1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	Company_Company_FullMethodName                  = "/comp.Company/Company"
	Company_Companies_FullMethodName                = "/comp.Company/Companies"
	Company_Issue_FullMethodName                    = "/comp.Company/Issue"
	Company_CompanyIssues_FullMethodName            = "/comp.Company/CompanyIssues"
	Company_AssignDeveloper_FullMethodName          = "/comp.Company/AssignDeveloper"
	Company_SubmitSolution_FullMethodName           = "/comp.Company/SubmitSolution"
	Company_IssueSolutions_FullMethodName           = "/comp.Company/IssueSolutions"
	Company_IssueSolution_FullMethodName            = "/comp.Company/IssueSolution"
	Company_CompanyGithubIntegration_FullMethodName = "/comp.Company/CompanyGithubIntegration"
	Company_DeveloperSolutions_FullMethodName       = "/comp.Company/DeveloperSolutions"
	Company_DeveloperInProgressTasks_FullMethodName = "/comp.Company/DeveloperInProgressTasks"
)

// CompanyClient is the client API for Company service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type CompanyClient interface {
	Company(ctx context.Context, in *GetCompanyRequest, opts ...grpc.CallOption) (*GetCompanyResponse, error)
	Companies(ctx context.Context, in *GetCompaniesRequest, opts ...grpc.CallOption) (*GetCompaniesResponse, error)
	Issue(ctx context.Context, in *GetIssueRequest, opts ...grpc.CallOption) (*GetIssueResponse, error)
	CompanyIssues(ctx context.Context, in *GetIssuesOfCompanyRequest, opts ...grpc.CallOption) (*GetIssuesOfCompanyResponse, error)
	AssignDeveloper(ctx context.Context, in *AssignDeveloperRequest, opts ...grpc.CallOption) (*AssignDeveloperResponse, error)
	SubmitSolution(ctx context.Context, in *SubmitSolutionRequest, opts ...grpc.CallOption) (*SubmitSolutionResponse, error)
	IssueSolutions(ctx context.Context, in *GetSolutionsOfIssueRequest, opts ...grpc.CallOption) (*GetSolutionsOfIssueResponse, error)
	IssueSolution(ctx context.Context, in *GetIssueSolutionRequest, opts ...grpc.CallOption) (*GetIssueSolutionResponse, error)
	CompanyGithubIntegration(ctx context.Context, in *GetCompanyGithubIntegrationRequest, opts ...grpc.CallOption) (*GetCompanyGithubIntegrationResponse, error)
	DeveloperSolutions(ctx context.Context, in *GetDeveloperSolutionsRequest, opts ...grpc.CallOption) (*GetDeveloperSolutionsResponse, error)
	DeveloperInProgressTasks(ctx context.Context, in *GetDeveloperInProgressTasksRequest, opts ...grpc.CallOption) (*GetDeveloperInProgressTasksResponse, error)
}

type companyClient struct {
	cc grpc.ClientConnInterface
}

func NewCompanyClient(cc grpc.ClientConnInterface) CompanyClient {
	return &companyClient{cc}
}

func (c *companyClient) Company(ctx context.Context, in *GetCompanyRequest, opts ...grpc.CallOption) (*GetCompanyResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetCompanyResponse)
	err := c.cc.Invoke(ctx, Company_Company_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) Companies(ctx context.Context, in *GetCompaniesRequest, opts ...grpc.CallOption) (*GetCompaniesResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetCompaniesResponse)
	err := c.cc.Invoke(ctx, Company_Companies_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) Issue(ctx context.Context, in *GetIssueRequest, opts ...grpc.CallOption) (*GetIssueResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetIssueResponse)
	err := c.cc.Invoke(ctx, Company_Issue_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) CompanyIssues(ctx context.Context, in *GetIssuesOfCompanyRequest, opts ...grpc.CallOption) (*GetIssuesOfCompanyResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetIssuesOfCompanyResponse)
	err := c.cc.Invoke(ctx, Company_CompanyIssues_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) AssignDeveloper(ctx context.Context, in *AssignDeveloperRequest, opts ...grpc.CallOption) (*AssignDeveloperResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(AssignDeveloperResponse)
	err := c.cc.Invoke(ctx, Company_AssignDeveloper_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) SubmitSolution(ctx context.Context, in *SubmitSolutionRequest, opts ...grpc.CallOption) (*SubmitSolutionResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(SubmitSolutionResponse)
	err := c.cc.Invoke(ctx, Company_SubmitSolution_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) IssueSolutions(ctx context.Context, in *GetSolutionsOfIssueRequest, opts ...grpc.CallOption) (*GetSolutionsOfIssueResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetSolutionsOfIssueResponse)
	err := c.cc.Invoke(ctx, Company_IssueSolutions_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) IssueSolution(ctx context.Context, in *GetIssueSolutionRequest, opts ...grpc.CallOption) (*GetIssueSolutionResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetIssueSolutionResponse)
	err := c.cc.Invoke(ctx, Company_IssueSolution_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) CompanyGithubIntegration(ctx context.Context, in *GetCompanyGithubIntegrationRequest, opts ...grpc.CallOption) (*GetCompanyGithubIntegrationResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetCompanyGithubIntegrationResponse)
	err := c.cc.Invoke(ctx, Company_CompanyGithubIntegration_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) DeveloperSolutions(ctx context.Context, in *GetDeveloperSolutionsRequest, opts ...grpc.CallOption) (*GetDeveloperSolutionsResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetDeveloperSolutionsResponse)
	err := c.cc.Invoke(ctx, Company_DeveloperSolutions_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *companyClient) DeveloperInProgressTasks(ctx context.Context, in *GetDeveloperInProgressTasksRequest, opts ...grpc.CallOption) (*GetDeveloperInProgressTasksResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetDeveloperInProgressTasksResponse)
	err := c.cc.Invoke(ctx, Company_DeveloperInProgressTasks_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// CompanyServer is the server API for Company service.
// All implementations must embed UnimplementedCompanyServer
// for forward compatibility.
type CompanyServer interface {
	Company(context.Context, *GetCompanyRequest) (*GetCompanyResponse, error)
	Companies(context.Context, *GetCompaniesRequest) (*GetCompaniesResponse, error)
	Issue(context.Context, *GetIssueRequest) (*GetIssueResponse, error)
	CompanyIssues(context.Context, *GetIssuesOfCompanyRequest) (*GetIssuesOfCompanyResponse, error)
	AssignDeveloper(context.Context, *AssignDeveloperRequest) (*AssignDeveloperResponse, error)
	SubmitSolution(context.Context, *SubmitSolutionRequest) (*SubmitSolutionResponse, error)
	IssueSolutions(context.Context, *GetSolutionsOfIssueRequest) (*GetSolutionsOfIssueResponse, error)
	IssueSolution(context.Context, *GetIssueSolutionRequest) (*GetIssueSolutionResponse, error)
	CompanyGithubIntegration(context.Context, *GetCompanyGithubIntegrationRequest) (*GetCompanyGithubIntegrationResponse, error)
	DeveloperSolutions(context.Context, *GetDeveloperSolutionsRequest) (*GetDeveloperSolutionsResponse, error)
	DeveloperInProgressTasks(context.Context, *GetDeveloperInProgressTasksRequest) (*GetDeveloperInProgressTasksResponse, error)
	mustEmbedUnimplementedCompanyServer()
}

// UnimplementedCompanyServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedCompanyServer struct{}

func (UnimplementedCompanyServer) Company(context.Context, *GetCompanyRequest) (*GetCompanyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Company not implemented")
}
func (UnimplementedCompanyServer) Companies(context.Context, *GetCompaniesRequest) (*GetCompaniesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Companies not implemented")
}
func (UnimplementedCompanyServer) Issue(context.Context, *GetIssueRequest) (*GetIssueResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Issue not implemented")
}
func (UnimplementedCompanyServer) CompanyIssues(context.Context, *GetIssuesOfCompanyRequest) (*GetIssuesOfCompanyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CompanyIssues not implemented")
}
func (UnimplementedCompanyServer) AssignDeveloper(context.Context, *AssignDeveloperRequest) (*AssignDeveloperResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AssignDeveloper not implemented")
}
func (UnimplementedCompanyServer) SubmitSolution(context.Context, *SubmitSolutionRequest) (*SubmitSolutionResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SubmitSolution not implemented")
}
func (UnimplementedCompanyServer) IssueSolutions(context.Context, *GetSolutionsOfIssueRequest) (*GetSolutionsOfIssueResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method IssueSolutions not implemented")
}
func (UnimplementedCompanyServer) IssueSolution(context.Context, *GetIssueSolutionRequest) (*GetIssueSolutionResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method IssueSolution not implemented")
}
func (UnimplementedCompanyServer) CompanyGithubIntegration(context.Context, *GetCompanyGithubIntegrationRequest) (*GetCompanyGithubIntegrationResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CompanyGithubIntegration not implemented")
}
func (UnimplementedCompanyServer) DeveloperSolutions(context.Context, *GetDeveloperSolutionsRequest) (*GetDeveloperSolutionsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeveloperSolutions not implemented")
}
func (UnimplementedCompanyServer) DeveloperInProgressTasks(context.Context, *GetDeveloperInProgressTasksRequest) (*GetDeveloperInProgressTasksResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeveloperInProgressTasks not implemented")
}
func (UnimplementedCompanyServer) mustEmbedUnimplementedCompanyServer() {}
func (UnimplementedCompanyServer) testEmbeddedByValue()                 {}

// UnsafeCompanyServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to CompanyServer will
// result in compilation errors.
type UnsafeCompanyServer interface {
	mustEmbedUnimplementedCompanyServer()
}

func RegisterCompanyServer(s grpc.ServiceRegistrar, srv CompanyServer) {
	// If the following call pancis, it indicates UnimplementedCompanyServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&Company_ServiceDesc, srv)
}

func _Company_Company_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetCompanyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).Company(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_Company_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).Company(ctx, req.(*GetCompanyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_Companies_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetCompaniesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).Companies(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_Companies_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).Companies(ctx, req.(*GetCompaniesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_Issue_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetIssueRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).Issue(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_Issue_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).Issue(ctx, req.(*GetIssueRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_CompanyIssues_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetIssuesOfCompanyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).CompanyIssues(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_CompanyIssues_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).CompanyIssues(ctx, req.(*GetIssuesOfCompanyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_AssignDeveloper_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AssignDeveloperRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).AssignDeveloper(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_AssignDeveloper_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).AssignDeveloper(ctx, req.(*AssignDeveloperRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_SubmitSolution_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SubmitSolutionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).SubmitSolution(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_SubmitSolution_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).SubmitSolution(ctx, req.(*SubmitSolutionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_IssueSolutions_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetSolutionsOfIssueRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).IssueSolutions(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_IssueSolutions_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).IssueSolutions(ctx, req.(*GetSolutionsOfIssueRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_IssueSolution_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetIssueSolutionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).IssueSolution(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_IssueSolution_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).IssueSolution(ctx, req.(*GetIssueSolutionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_CompanyGithubIntegration_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetCompanyGithubIntegrationRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).CompanyGithubIntegration(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_CompanyGithubIntegration_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).CompanyGithubIntegration(ctx, req.(*GetCompanyGithubIntegrationRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_DeveloperSolutions_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetDeveloperSolutionsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).DeveloperSolutions(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_DeveloperSolutions_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).DeveloperSolutions(ctx, req.(*GetDeveloperSolutionsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Company_DeveloperInProgressTasks_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetDeveloperInProgressTasksRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CompanyServer).DeveloperInProgressTasks(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Company_DeveloperInProgressTasks_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CompanyServer).DeveloperInProgressTasks(ctx, req.(*GetDeveloperInProgressTasksRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Company_ServiceDesc is the grpc.ServiceDesc for Company service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Company_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "comp.Company",
	HandlerType: (*CompanyServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Company",
			Handler:    _Company_Company_Handler,
		},
		{
			MethodName: "Companies",
			Handler:    _Company_Companies_Handler,
		},
		{
			MethodName: "Issue",
			Handler:    _Company_Issue_Handler,
		},
		{
			MethodName: "CompanyIssues",
			Handler:    _Company_CompanyIssues_Handler,
		},
		{
			MethodName: "AssignDeveloper",
			Handler:    _Company_AssignDeveloper_Handler,
		},
		{
			MethodName: "SubmitSolution",
			Handler:    _Company_SubmitSolution_Handler,
		},
		{
			MethodName: "IssueSolutions",
			Handler:    _Company_IssueSolutions_Handler,
		},
		{
			MethodName: "IssueSolution",
			Handler:    _Company_IssueSolution_Handler,
		},
		{
			MethodName: "CompanyGithubIntegration",
			Handler:    _Company_CompanyGithubIntegration_Handler,
		},
		{
			MethodName: "DeveloperSolutions",
			Handler:    _Company_DeveloperSolutions_Handler,
		},
		{
			MethodName: "DeveloperInProgressTasks",
			Handler:    _Company_DeveloperInProgressTasks_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "company.proto",
}
