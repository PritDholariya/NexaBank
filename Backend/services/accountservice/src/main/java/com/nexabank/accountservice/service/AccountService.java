package com.nexabank.accountservice.service;

import com.nexabank.accountservice.dto.AccountRegistrationRequest;
import com.nexabank.accountservice.dto.AccountRegistrationResponse;
import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.entity.Customer;
import com.nexabank.accountservice.repository.AccountRepository;
import com.nexabank.accountservice.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service // Tells Spring: "This is a Business Logic class. Load it into memory!"
@RequiredArgsConstructor // Lombok: Automatically injects the repository for us!
public class AccountService {

    // This is Dependency Injection. The Service asks for the Repository to talk to the DB.
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    // This annotation is magic. It means if the Account fails to save, 
    // it will automatically delete the Customer from the Database so we don't end up with broken data!
    @Transactional 
    public AccountRegistrationResponse registerCustomerAccount(AccountRegistrationRequest request) {
        
        // 1. Generate core banking credentials
        String clientId = "NEXA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String rawPassword = UUID.randomUUID().toString().substring(0, 8); // e.g. 5F3A9D12
        
        // 2. Build and Save the Customer Profile
        Customer customer = Customer.builder()
                .clientId(clientId)
                .name(request.name())
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .address(request.address())
                .dateOfBirth(request.dateOfBirth())
                .governmentId(request.governmentId())
                .passwordHash(rawPassword) // IN PRODUCTION: This MUST be Bcrypt encrypted!
                .build();
        
        customer = customerRepository.save(customer);

        // 3. Generate Bank Account specific details
        String iban = "NX" + ThreadLocalRandom.current().nextLong(1000000000000000L, 9999999999999999L);
        String bic = "NEXAXXGB";

        // 4. Build and Save the financial Account
        Account account = Account.builder()
                .iban(iban)
                .bic(bic)
                .accountType(request.accountType())
                .customerId(customer.getId())
                .balance(BigDecimal.ZERO)
                .build();

        accountRepository.save(account);

        // 5. Send the simulated email
        emailService.sendWelcomeEmail(customer.getEmail(), customer.getName(), clientId, rawPassword, iban);

        // 6. Return the success payload to the user
        return new AccountRegistrationResponse(
                clientId,
                iban,
                bic,
                "Password has been sent to your registered email.",
                "Account Registration Successful!"
        );
    }
    
    public Account getAccount(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
    }
}
