.PHONY: protoc/auth
protoc/auth:
	@echo 'Updating proto...'
	protoc -I protos protos/auth.proto --go_out=services/auth/gen/auth --go_opt=paths=source_relative --go-grpc_out=services/auth/gen/auth --go-grpc_opt=paths=source_relative



.PHONY: db/migrations/new
db/migrations/new/auth:
	@echo 'Creating migration files for ${name}...'
	migrate create -seq -ext=sql -dir=D:/ProgramData/workspacego/diploma/services/auth/migrations ${name}


.PHONY: db/migrations/up
db/migrations/up/auth:
	@echo 'Running up migrations for auth service...'
	migrate -path=D:/ProgramData/workspacego/diploma/services/auth/migrations -database=postgres://postgres:256782366595d@localhost:5433/taskhub_db?sslmode=disable up