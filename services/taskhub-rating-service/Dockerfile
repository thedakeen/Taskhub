FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

COPY services/taskhub-rating-service/pom.xml .
RUN mvn dependency:go-offline -B

COPY services/taskhub-rating-service/src ./src
COPY services/taskhub-rating-service/.mvn ./.mvn
COPY services/taskhub-rating-service/mvnw .

RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8091

CMD ["java", "-jar", "app.jar"]