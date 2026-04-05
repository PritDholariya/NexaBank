# NexaBank

Welcome to **NexaBank**, a modernized Spring Boot-based Microservices banking application.

This README provides comprehensive documentation on the project architecture, prerequisites, setup instructions, and how to verify that everything is running properly.

---

## 🏛 Architecture Overview

NexaBank is built using a resilient Microservices Architecture. 
The system is divided into decoupled services communicating with each other and backed by a robust data tier.

### Current Services:
* **Eureka Discovery Server (`discovery-server`)**: Acts as a phonebook for services. All microservices register themselves here, allowing dynamic routing without hardcoded IP addresses. (Runs on port `8761`).
* **API Gateway (`apigateway`)**: The singular entry point for the frontend clients. It routes external requests to the appropriate internal microservices asynchronously. (Runs on port `8080`).
* **Account Service (`accountservice`)**: Handles the core logic regarding user accounts. It safely manages customer details, issues banking credentials (IBAN, BIC, Client ID), and tracks account types. (Runs on port `8081`).
* **Authentication Service (`authservice`)**: Responsible for securely authenticating users, verifying credentials, and issuing JWT or auth tokens. It communicates internally with the Account Service to validate logins. (Runs on port `8082`).

---

## 🛠 Technology Stack

* **Java / Spring Boot**: Core framework for all microservices.
* **Spring Cloud Gateway**: For the API Gateway.
* **Netflix Eureka**: Service discovery and registration.
* **Spring Cloud OpenFeign**: For internal synchronous microservice-to-microservice communication (e.g. Auth Service talking to Account Service).
* **PostgreSQL**: Relational database for persistent storage of Customer and Account details.
* **Docker / Docker Compose**: Containerization for the database, cache, and messaging infrastructure.
* **Swagger/OpenAPI UI**: Automated interactive API documentation.
* **Lombok / SLF4J**: For boilerplate reduction and robust logging.

---

## ⚙️ Prerequisites

To run this backend on your local machine, ensure you have the following installed:
1. **Java Development Kit (JDK) 17** (or higher)
2. **Apache Maven**
3. **Docker Engine & Docker Compose** (for running Postgres, Redis, Kafka, etc.)

---

## 🚀 Getting Started & Setup Guide

### 1. Start the Infrastructure (Database, Kafka, etc.)
We need to spin up the local PostgreSQL database along with Redis and Kafka. From the `Backend` directory, run:

```bash
cd Backend
docker-compose up -d
```

> **Note**: PostgreSQL is mapped to port `5433` (as per `docker-compose.yml`) to avoid conflicts with local installations, using `nexa` / `nexa_password` for credentials.

### 2. Start the Microservices
The services must be started in a specific order so that dependencies (like Eureka) are available immediately. You can run these commands in separate terminal tabs, from within the `Backend` directory:

**Terminal 1:** Start the Discovery Server
```bash
mvn spring-boot:run -pl services/discovery-server
```

**Terminal 2:** Start the API Gateway
```bash
mvn spring-boot:run -pl services/apigateway
```

**Terminal 3:** Start the Account Service
```bash
mvn spring-boot:run -pl services/accountservice
```

**Terminal 4:** Start the Auth Service
```bash
mvn spring-boot:run -pl services/authservice
```

---

## 🧪 Testing the APIs & Documentation

Once all services are up and running, you can interact with the backend endpoints via the API Gateway or view their localized Swagger UI pages.

### Interactive Swagger UI (OpenAPI)
The `accountservice & authservice` provides a Swagger UI out of the box. Navigate to:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

### Key External Endpoints
All external traffic should ideally go through the API Gateway running on port `8080`.
<!-- 
1. **Register User Account**
   - **Method**: `POST`
   - **URL**: `http://localhost:8080/api/accounts/register`
   - **Payload**:
     ```json
     {
       "name": "Jane Doe",
       "email": "jane@example.com",
       "phoneNumber": "+1234567890",
       "address": "123 Nexa Street, Tech City",
       "dateOfBirth": "1990-01-01",
       "governmentId": "AB123456C",
       "accountType": "SAVINGS"
     }
     ```

2. **Approve Application (Admin Only)**
   - **Method**: `POST`
   - **URL**: `http://localhost:8080/api/accounts/admin/approve/{customerId}`

3. **Authentication (Login Context)**
   - **Prefix Routed**: `http://localhost:8080/api/auth/**` (Routed automatically to the Auth Service). -->

### Key Internal APIs
The Account Service exposes internal routines primarily dedicated for usage by the Auth Service to validate and manipulate account access mechanisms:
* `/internal/verify`: Authenticates Customer credentials.
* `/internal/requires-password-change`: Checks if a user is logging in on a temporary password.
* `/internal/change-password`: Modifies user access credentials securely.

---

## 💡 Checking Logs
We use SLF4J for logging. When running your Spring Boot applications, watch the console logs heavily. You will log tracking for actions like incoming REST requests via the API Gateway and account approvals in the Account Service.

---

### Running Unit Tests
To verify the internal stability of individual modules (e.g., accountservice):
```bash
mvn clean test -pl services/accountservice
```
