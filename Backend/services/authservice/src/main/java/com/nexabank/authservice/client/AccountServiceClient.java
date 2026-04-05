package com.nexabank.authservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

// This annotation is magic! It tells Spring: "Look inside the Eureka phonebook for 'ACCOUNT-SERVICE'."
// Whenever we call a method in this interface, Feign will automatically translate it into a real HTTP network request!
@FeignClient(name = "ACCOUNT-SERVICE")
public interface AccountServiceClient {

    // Notice how these perfectly match the URLs we built in AccountController!
    
    @PostMapping("/api/accounts/internal/verify")
    String verifyCredentials(@RequestParam("clientId") String clientId, @RequestParam("password") String password);

    @PostMapping("/api/accounts/internal/requires-password-change")
    Boolean requiresPasswordChange(@RequestParam("clientId") String clientId);

    @PostMapping("/api/accounts/internal/change-password")
    void changePassword(@RequestParam("clientId") String clientId, @RequestParam("newPassword") String newPassword);
}
