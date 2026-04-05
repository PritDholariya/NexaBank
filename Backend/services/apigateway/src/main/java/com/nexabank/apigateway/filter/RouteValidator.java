package com.nexabank.apigateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // These endpoints do NOT require a JWT token!
    public static final List<String> openApiEndpoints = List.of(
            "/api/auth/login",
            "/api/auth/change-password",
            "/api/accounts/register",
            "/eureka",
            "/v3/api-docs",
            "/swagger-ui",
            "/swagger-resources",
            "/v3/api-docs/account-service",
            "/v3/api-docs/auth-service"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
