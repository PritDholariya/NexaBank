package com.nexabank.accountservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j // Lombok annotation to give us automatic logging!
public class EmailService {

    // In the future this will connect to SendGrid or AWS SES
    public void sendWelcomeEmail(String toEmail, String name, String clientId, String rawPassword, String iban) {
        log.info("==========================================================");
        log.info("📧 MOCK EMAIL SENT TO: {}", toEmail);
        log.info("Subject: Welcome to NexaBank, {}!", name);
        log.info("Body:");
        log.info("Your account is successfully created.");
        log.info("Your Client ID: {}", clientId);
        log.info("Your Initial Password: {}", rawPassword);
        log.info("Your new IBAN: {}", iban);
        log.info("Please login and change your password immediately.");
        log.info("==========================================================");
    }
}
