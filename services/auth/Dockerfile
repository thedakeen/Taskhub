FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY services/auth/go.mod services/auth/go.sum ./
RUN go mod download

COPY services/auth/ ./

COPY .env ../.env

RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service ./cmd/auth/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/auth-service .

COPY .env ../.env

COPY services/auth/migrations ./migrations/

EXPOSE 8081 50051

CMD ["./auth-service"]