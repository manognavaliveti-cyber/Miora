# Multi-stage Dockerfile for MIORA Spring Boot Backend (Java 17)
# Stage 1: Build application with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java 17 Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR into target/ folder
COPY --from=builder /app/target/server-springboot-1.0.0.jar ./target/server-springboot-1.0.0.jar

EXPOSE 8080

# Run Spring Boot application
CMD ["java", "-jar", "target/server-springboot-1.0.0.jar"]
