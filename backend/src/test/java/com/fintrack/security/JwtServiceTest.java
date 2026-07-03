package com.fintrack.security;

import com.fintrack.entity.Role;
import com.fintrack.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // Set properties that are normally injected via @Value
        ReflectionTestUtils.setField(jwtService, "secretKey", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L); // 1 day
    }

    @Test
    void testGenerateTokenAndExtractUsername() {
        User user = User.builder()
                .email("test@example.com")
                .password("password")
                .role(Role.USER)
                .build();

        String token = jwtService.generateToken(user);
        
        assertNotNull(token);
        
        String extractedEmail = jwtService.extractUsername(token);
        assertEquals("test@example.com", extractedEmail);
    }

    @Test
    void testIsTokenValid() {
        User user = User.builder()
                .email("test@example.com")
                .password("password")
                .role(Role.USER)
                .build();

        String token = jwtService.generateToken(user);
        
        assertTrue(jwtService.isTokenValid(token, user));
    }
}
