FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY services/company/go.mod services/company/go.sum ./
RUN go mod download

COPY services/company/ ./

COPY .env ../.env

RUN CGO_ENABLED=0 GOOS=linux go build -o company-service ./cmd/company/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/company-service .

COPY .env ../.env

# Expose ports
EXPOSE 8082 50052

CMD ["./company-service"]