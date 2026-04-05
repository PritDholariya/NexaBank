package com.nexabank.accountservice.seeder;

import com.github.javafaker.Faker;
import com.nexabank.accountservice.entity.Customer;
import com.nexabank.accountservice.entity.CustomerStatus;
import com.nexabank.accountservice.entity.Role;
import com.nexabank.accountservice.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final CustomerRepository customerRepository;

    @Value("${ADMIN_EMAIL:admin@nexabank.com}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:admin}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedFakeCustomers();
    }

    private void seedAdmin() {
        Optional<Customer> adminOpt = customerRepository.findByEmail(adminEmail);
        
        if (adminOpt.isEmpty()) {
            Customer admin = Customer.builder()
                    .name("Master System Admin")
                    .email(adminEmail)
                    .address("Bank HQ")
                    .phoneNumber("000-000-0000")
                    .role(Role.ROLE_ADMIN)                  // THIS MAKES THEM AN ADMIN!
                    .status(CustomerStatus.APPROVED)
                    .clientId("NEXA-MASTER-ADMIN")
                    .passwordHash(adminPassword)                
                    .requiresPasswordChange(false)
                    // Bypassing normal checks, using dummy values for nullable columns
                    .dateOfBirth(java.time.LocalDate.of(1990, 1, 1))
                    .governmentId("ADMIN-001")
                    .preferredAccountType(com.nexabank.accountservice.entity.AccountType.CURRENT)
                    .build();
            
            customerRepository.save(admin);
            log.info("SECURITY LAUNCH: Auto-Generated Master Admin Account: {} / {}", adminEmail, adminPassword);
        } else {
            log.info("SECURITY LAUNCH: Master Admin already exists.");
        }
    }

    private void seedFakeCustomers() {
        // Only seed if we have fewer than 5 customers
        if (customerRepository.count() < 10) {
            log.info("SEEDER: Generating 10 fake PENDING customers for testing...");
            Faker faker = new Faker();
            
            for (int i = 0; i < 10; i++) {
                Customer fakeCustomer = Customer.builder()
                        .name(faker.name().fullName())
                        .email(faker.internet().emailAddress())
                        .address(faker.address().fullAddress())
                        .phoneNumber(faker.phoneNumber().cellPhone())
                        .role(Role.ROLE_USER)
                        .status(CustomerStatus.PENDING) // Completely unapproved!
                        .requiresPasswordChange(true)
                        .dateOfBirth(java.time.LocalDate.of(
                                faker.number().numberBetween(1950, 2005), 
                                faker.number().numberBetween(1, 12), 
                                faker.number().numberBetween(1, 28)))
                        .governmentId(faker.number().digits(9))
                        .preferredAccountType(com.nexabank.accountservice.entity.AccountType.SAVINGS)
                        .build();
                
                customerRepository.save(fakeCustomer);
            }
            log.info("SEEDER: Successfully generated 10 fake customers.");
        }
    }
}
