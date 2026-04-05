package com.nexabank.accountservice.repository;

import com.nexabank.accountservice.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nexabank.accountservice.entity.CustomerStatus;
import java.util.Optional;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByClientId(String clientId);
    List<Customer> findByStatus(CustomerStatus status);
}
