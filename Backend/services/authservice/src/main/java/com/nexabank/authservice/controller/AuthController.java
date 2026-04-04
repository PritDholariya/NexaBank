package com.nexabank.authservice.controller;

import com.nexabank.authservice.client.AccountServiceClient;
import com.nexabank.authservice.dto.AuthResponse;
import com.nexabank.authservice.dto.ChangePasswordRequest;
import com.nexabank.authservice.dto.LoginRequest;
import com.nexabank.authservice.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Authentication Management", description = "Endpoints for user login and password management")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AccountServiceClient accountServiceClient; // The Phone Line to AccountService!
    private final JwtUtils jwtUtils; // The cryptographic token generator

    @Operation(summary = "Authenticate User", description = "Verifies the client ID and password to grant an access token.")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Attempting login for Client ID: {}", request.clientId());
        
        // 1. Ask AccountService if the password is correct
        Boolean isValid = accountServiceClient.verifyCredentials(request.clientId(), request.password());
        if (!Boolean.TRUE.equals(isValid)) {
            // Return 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(null, "Invalid Credentials"));
        }

        // 2. Check if they are forced to change their password
        Boolean requiresChange = accountServiceClient.requiresPasswordChange(request.clientId());
        if (Boolean.TRUE.equals(requiresChange)) {
            // Return 403 Forbidden with a special state
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AuthResponse(null, "PASSWORD_CHANGE_REQUIRED"));
        }

        // 3. Generate a secure Login Token!
        String token = jwtUtils.generateJwtToken(request.clientId());
        
        // Return 200 OK
        return ResponseEntity.ok(new AuthResponse(token, "Login Successful!"));
    }

    @Operation(summary = "Change Password", description = "Changes the temporary password to a user-defined secure password and auto-logs them in.")
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        log.info("Attempting password reset for Client ID: {}", request.clientId());

        // 1. Verify old password first
        Boolean isValid = accountServiceClient.verifyCredentials(request.clientId(), request.oldPassword());
        if (!Boolean.TRUE.equals(isValid)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(null, "Invalid Old Password"));
        }

        // 2. Command Account Service to update the password in Postgres
        accountServiceClient.changePassword(request.clientId(), request.newPassword());

        // 3. Log them in automatically with the new password!
        String token = jwtUtils.generateJwtToken(request.clientId());
        
        return ResponseEntity.ok(new AuthResponse(token, "Password changed successfully! You are now logged in."));
    }
}
