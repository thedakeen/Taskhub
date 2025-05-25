include .env



.PHONY: protoc
protoc/auth:
	@echo 'Updating proto...'
	protoc --proto_path protos --proto_path vendor.protogen \
	--go_out=services/auth/gen/auth --go_opt=paths=source_relative --go-grpc_out=services/auth/gen/auth --go-grpc_opt=paths=source_relative \
	--plugin=protoc-gen-go-grpc=${PROTOC_GEN_PATH} \
  	--grpc-gateway_out=services/auth/gen/auth --grpc-gateway_opt=paths=source_relative \
  	--plugin=protoc-gen-grpc-gateway=${PROTOC_GATEWAY_PATH} \
  	--plugin=protoc-gen-openapiv2=${PROTOC_OPENAPIV2_PATH} \
  	--openapiv2_out=services/auth/swagger --openapiv2_opt=allow_merge=true,merge_file_name=swagger.json \
  	--go_out=services/company/gen/auth --go_opt=paths=source_relative \
    --go-grpc_out=services/company/gen/auth --go-grpc_opt=paths=source_relative \
    --grpc-gateway_out=services/company/gen/auth --grpc-gateway_opt=paths=source_relative \
  	protos/auth.proto

protoc/comp:
	@echo 'Updating proto...'
	protoc --proto_path protos --proto_path vendor.protogen \
	--go_out=services/company/gen/company --go_opt=paths=source_relative --go-grpc_out=services/company/gen/company --go-grpc_opt=paths=source_relative \
	--plugin=protoc-gen-go-grpc=${PROTOC_GEN_PATH} \
  	--grpc-gateway_out=services/company/gen/company --grpc-gateway_opt=paths=source_relative \
  	--plugin=protoc-gen-grpc-gateway=${PROTOC_GATEWAY_PATH} \
  	--plugin=protoc-gen-openapiv2=${PROTOC_OPENAPIV2_PATH} \
  	--openapiv2_out=services/company/swagger --openapiv2_opt=allow_merge=true,merge_file_name=swagger.json \
  	protos/company.proto


.PHONY: vendor-proto
vendor-proto:
		@if [ ! -d vendor.protogen/google ]; then \
			git clone https://github.com/googleapis/googleapis vendor.protogen/googleapis &&\
			mkdir -p  vendor.protogen/google/ &&\
			mv vendor.protogen/googleapis/google/api vendor.protogen/google &&\
			rm -rf vendor.protogen/googleapis ;\
		fi
#		@if [ ! -d vendor.protogen/openapiv2 ]; then \
#    		git clone https://github.com/grpc-ecosystem/grpc-gateway.git vendor.protogen/grpc-gateway && \
#    		mkdir -p vendor.protogen/openapiv2/ && \
#    		mv vendor.protogen/grpc-gateway/protoc-gen-openapiv2/* vendor.protogen/openapiv2/ && \
#    		rm -rf vendor.protogen/grpc-gateway ; \
#    	fi





.PHONY: db/migrations/new
db/migrations/new:
	@echo 'Creating migration files for ${name}...'
	migrate create -seq -ext=sql -dir=D:/ProgramData/workspacego/diploma/services/auth/migrations ${name}


.PHONY: db/migrations
db/migrations/up:
	@echo 'Running up migrations...'
	migrate -path=D:/ProgramData/workspacego/diploma/services/auth/migrations -database=${POSTGRES_URI} up

db/migrations/down:
	@echo 'Running up migrations ...'
	migrate -path=D:/ProgramData/workspacego/diploma/services/auth/migrations -database=${POSTGRES_URI} down 1


.PHONY: all auth company run

run:
	start /b cmd /c "cd services/auth && go run ./cmd/auth 2>&1" & \
	start /b cmd /c "cd services/company && go run ./cmd/company 2>&1"




STORAGE_PATH = postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=$(DB_SSL_MODE)

.PHONY: setup db/dump/create db/dump/restore up down restart logs clean

setup:
	@echo "🚀 Setting up the project..."
	@if [ ! -f .env ]; then \
		echo "Creating .env file from services/.env..."; \
		cp services/.env .env; \
		echo "DB_USER=postgres" >> .env; \
		echo "DB_PASSWORD=123456" >> .env; \
		echo "DB_NAME=taskhub_db" >> .env; \
		echo "DB_HOST=postgres" >> .env; \
		echo "DB_PORT=5432" >> .env; \
		echo "DB_SSL_MODE=disable" >> .env; \
		echo "AUTH_CLIENT_ADDRESS=auth:50051" >> .env; \
		echo ".env file created. You may want to edit it before continuing."; \
		echo "Press Enter to continue or Ctrl+C to abort and edit .env first."; \
		read dummy; \
	fi
	@echo "Creating dumps directory..."
	@mkdir -p dumps
	@echo "Building Docker images..."
	docker compose build
	@echo "Starting database..."
	docker compose up -d postgres
	@echo "Waiting for database to initialize..."
	@sleep 5
	@if [ -f ./dumps/taskhub_db.custom ]; then \
		echo "Found existing database dump, restoring..."; \
		$(MAKE) db/dump/restore; \
	else \
		echo "No existing dump found, creating initial database..."; \
		echo "Running migrations..."; \
		DB_CONTAINER_HOST=$$(docker compose port postgres 5432 | cut -d ':' -f 1); \
		CONTAINER_STORAGE_PATH="postgres://$(DB_USER):$(DB_PASSWORD)@$$DB_CONTAINER_HOST:$$(docker compose port postgres 5432 | cut -d ':' -f 2)/$(DB_NAME)?sslmode=$(DB_SSL_MODE)"; \
		echo "Using database connection: $$CONTAINER_STORAGE_PATH"; \
		docker run --rm -v $$(pwd)/services/auth/migrations:/migrations --network host migrate/migrate \
			-path=/migrations -database=$$CONTAINER_STORAGE_PATH up; \
		echo "Creating initial dump..."; \
		$(MAKE) db/dump/create; \
	fi
	@echo "Starting all services..."
	docker compose up -d
	@echo "	Setup complete! The application is now running."
	@echo "   Auth HTTP server is available at http://localhost:8081"
	@echo "   Company HTTP server is available at http://localhost:8082"
	@echo "   Admin server is available at http://localhost:8090"
	@echo "   Rating server is available at http://localhost:8091"
	@echo "   You can view logs with: docker compose logs -f"

db/dump/create:
	@echo "Creating database dump..."
	docker compose run --rm db-tools /db_dump.sh

db/dump/restore:
	@echo "Restoring database from dump..."
	docker compose run --rm db-tools /db_restore.sh

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

clean:
	docker compose down -v