package com.nexabank.accountservice.service;

import com.nexabank.accountservice.dto.AccountRegistrationRequest;
import com.nexabank.accountservice.dto.AccountRegistrationResponse;
import com.nexabank.accountservice.dto.AccountApprovalResponse;
import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.entity.Customer;
import com.nexabank.accountservice.entity.CustomerStatus;
import com.nexabank.accountservice.repository.AccountRepository;
import com.nexabank.accountservice.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    // STEP 1: USER APPLICATION
    @Transactional 
    public AccountRegistrationResponse registerCustomerAccount(AccountRegistrationRequest request) {
        log.info("Starting account registration process for: {}", request.email());
        
        Customer customer = Customer.builder()
                .name(request.name())
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .address(request.address())
                .dateOfBirth(request.dateOfBirth())
                .governmentId(request.governmentId())
                .preferredAccountType(request.accountType())
                // Set the status to PENDING, force password change, but NO clientId or password yet!
                .status(CustomerStatus.PENDING)
                .requiresPasswordChange(true)
                .build();
        
        customer = customerRepository.save(customer);

        emailService.sendPendingReviewEmail(customer.getEmail(), customer.getName());

        return new AccountRegistrationResponse(
                customer.getId(),
                CustomerStatus.PENDING,
                "Your application is securely saved and is pending admin review."
        );
    }

    // STEP 2: ADMIN APPROVAL
    @Transactional 
    public AccountApprovalResponse approveCustomerApplication(Long customerId) {
        log.info("Admin approval process initiated for customer ID: {}", customerId);
        
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.error("Approval failed. Customer ID {} not found.", customerId);
                    return new RuntimeException("Customer not found!");
                });

        if (customer.getStatus() != CustomerStatus.PENDING) {
            throw new RuntimeException("Customer is not purely PENDING. Current status: " + customer.getStatus());
        }

        // 1. Generate core banking credentials
        String clientId = "NEXA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String rawPassword = UUID.randomUUID().toString().substring(0, 8); 
        
        customer.setClientId(clientId);
        customer.setPasswordHash(rawPassword); // IN PRODUCTION: This MUST be Bcrypt encrypted!
        customer.setStatus(CustomerStatus.APPROVED);
        customerRepository.save(customer);

        // 2. Generate Bank Account specific details
        String iban = "NX" + ThreadLocalRandom.current().nextLong(1000000000000000L, 9999999999999999L);
        String bic = "NEXAXXGB";

        Account account = Account.builder()
                .iban(iban)
                .bic(bic)
                .accountType(customer.getPreferredAccountType())
                .customerId(customer.getId())
                .balance(BigDecimal.ZERO)
                .build();

        accountRepository.save(account);

        // 3. Send final approval email
        emailService.sendApprovalEmail(customer.getEmail(), customer.getName(), clientId, rawPassword, iban);

        return new AccountApprovalResponse(
                clientId,
                iban,
                bic,
                "Account Approved and generated! Sent credentials via email."
        );
    }

    public Account getAccount(Long id) {
        log.info("Fetching account by ID: {}", id);
        return accountRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Account ID {} not found.", id);
                    return new RuntimeException("Account not found with ID: " + id);
                });
    }
}
