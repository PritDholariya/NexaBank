package com.nexabank.accountservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j 
public class EmailService {

    public void sendPendingReviewEmail(String toEmail, String name) {
        log.info("==========================================================");
        log.info("📧 MOCK EMAIL SENT TO: {}", toEmail);
        log.info("Subject: NexaBank Application Received");
        log.info("Body:");
        log.info("Hello {},", name);
        log.info("We have successfully received your application.");
        log.info("Your details are currently Under Review by our Admin team.");
        log.info("You will receive another email once approved with your login details.");
        log.info("==========================================================");
    }

    public void sendApprovalEmail(String toEmail, String name, String clientId, String rawPassword, String iban) {
        log.info("==========================================================");
        log.info("📧 MOCK EMAIL SENT TO: {}", toEmail);
        log.info("Subject: Welcome to NexaBank, {}!", name);
        log.info("Body:");
        log.info("Congratulations, your account has been APPROVED.");
        log.info("Your Client ID: {}", clientId);
        log.info("Your Initial Password: {}", rawPassword);
        log.info("Your new IBAN: {}", iban);
        log.info("IMPORTANT: You must change your password upon first login!");
        log.info("==========================================================");
    }

    public void sendRejectionEmail(String toEmail, String name, String reason) {
        log.info("==========================================================");
        log.info("📧 MOCK EMAIL SENT TO: {}", toEmail);
        log.info("Subject: NexaBank Application Update");
        log.info("Body:");
        log.info("Hello {},", name);
        log.info("Unfortunately, your NexaBank application has been REJECTED.");
        log.info("Reason for Rejection: {}", reason);
        log.info("Please review this feedback, make the necessary changes, and try again.");
        log.info("==========================================================");
    }
}
