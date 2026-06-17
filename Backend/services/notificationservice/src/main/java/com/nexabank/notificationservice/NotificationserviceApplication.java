package com.nexabank.notificationservice;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Notification Service — Phase 7
 *
 * Passively consumes Kafka events from "balance-updates" and
 * "transaction-status-updates" topics, stores notification records in PostgreSQL,
 * and exposes a REST API for the frontend to fetch and mark notifications.
 *
 * Port: 8084 | Consumer Group: notification-service-group
 */
@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "NexaBank Notification Service API",
                version = "1.0",
                description = "Manages user notifications for transactions and account events"
        ),
        servers = @Server(url = "/", description = "Gateway Server")
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class NotificationserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationserviceApplication.class, args);
    }
}
