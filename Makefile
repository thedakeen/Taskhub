include .env



.PHONY: protoc/auth
protoc/auth:
	@echo 'Updating proto...'
	protoc --proto_path protos --proto_path vendor.protogen \
	--go_out=services/auth/gen/auth --go_opt=paths=source_relative --go-grpc_out=services/auth/gen/auth --go-grpc_opt=paths=source_relative \
	--plugin=protoc-gen-go-grpc=${PROTOC_GEN_PATH} \
  	--grpc-gateway_out=services/auth/gen/auth --grpc-gateway_opt=paths=source_relative \
  	--plugin=protoc-gen-grpc-gateway=${PROTOC_GATEWAY_PATH} \
  	protos/auth.proto

.PHONY: vendor-proto
vendor-proto:
		@if [ ! -d vendor.protogen/google ]; then \
			git clone https://github.com/googleapis/googleapis vendor.protogen/googleapis &&\
			mkdir -p  vendor.protogen/google/ &&\
			mv vendor.protogen/googleapis/google/api vendor.protogen/google &&\
			rm -rf vendor.protogen/googleapis ;\
		fi

.PHONY: vendor-proto
vendor-proto:
		@if [ ! -d vendor.protogen/google ]; then \
			git clone https://github.com/googleapis/googleapis vendor.protogen/googleapis &&\
			mkdir -p  vendor.protogen/google/ &&\
			mv vendor.protogen/googleapis/google/api vendor.protogen/google &&\
			rm -rf vendor.protogen/googleapis ;\
		fi





.PHONY: db/migrations/new
db/migrations/new/auth:
	@echo 'Creating migration files for ${name}...'
	migrate create -seq -ext=sql -dir=D:/ProgramData/workspacego/diploma/services/auth/migrations ${name}


.PHONY: db/migrations/up
db/migrations/up/auth:
	@echo 'Running up migrations for auth service...'
	migrate -path=D:/ProgramData/workspacego/diploma/services/auth/migrations -database=${POSTGRES_URI} up





