@echo off
echo ==========================================
echo Starting NexaBank Local Environment
echo ==========================================

echo.
echo [1/2] Starting Docker Infrastructure (Postgres, Redis, Kafka)...
:: Clean up old ghosts from when the folder was named NexaBank!
docker rm -f nexa-postgres nexa-redis nexa-zookeeper nexa-kafka >nul 2>&1
docker compose up -d

echo.
echo [2/2] Starting Java Microservices...
echo (Opening in new terminal windows so you can see their logs!)

:: Start the Discovery Server first and wait a few seconds so others can find it
start "Discovery Server" cmd /k mvn spring-boot:run -pl services/discovery-server
timeout /t 15

:: Start the Gateway and Account Service
start "API Gateway" cmd /k mvn spring-boot:run -pl services/apigateway
start "Account Service" cmd /k mvn spring-boot:run -pl services/accountservice
start "Auth Service" cmd /k mvn spring-boot:run -pl services/authservice

echo.
echo ==========================================
echo All services are starting! 
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway:      http://localhost:8080
echo ==========================================
echo You can close this window.
pause
