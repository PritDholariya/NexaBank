package com.nexabank.authservice.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    // For production, this MUST be deeply hidden in environment variables!
    // But for local development, we generate a magic crypto key when the server starts.
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 1 Hour Expiration
    private final long jwtExpirationMs = 3600000;

    public String generateJwtToken(String clientId) {
        return Jwts.builder()
                .setSubject(clientId)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }
}
