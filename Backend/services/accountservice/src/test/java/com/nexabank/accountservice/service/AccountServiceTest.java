package com.nexabank.accountservice.service;

import com.nexabank.accountservice.entity.Account;
import com.nexabank.accountservice.repository.AccountRepository;
import com.nexabank.accountservice.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AccountService accountService;

    @Test
    void getAccount_Success() {
        // Arrange
        Account mockAccount = Account.builder()
                .id(1L)
                .iban("NX1234567890123456")
                .bic("NEXAXXGB")
                .balance(BigDecimal.ZERO)
                .customerId(100L)
                .build();
                
        when(accountRepository.findById(1L)).thenReturn(Optional.of(mockAccount));

        // Act
        Account result = accountService.getAccount(1L);

        // Assert
        assertNotNull(result);
        assertEquals("NX1234567890123456", result.getIban());
        assertEquals(BigDecimal.ZERO, result.getBalance());
        assertEquals(100L, result.getCustomerId());
    }

    @Test
    void getAccount_NotFound_ThrowsException() {
        // Arrange
        when(accountRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> accountService.getAccount(99L));
        assertEquals("Account not found with ID: 99", exception.getMessage());
    }
}
