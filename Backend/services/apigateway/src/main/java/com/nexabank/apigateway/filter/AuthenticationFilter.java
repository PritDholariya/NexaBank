package com.nexabank.apigateway.filter;

import com.nexabank.apigateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            
            // Check if the current URL requires security
            if (validator.isSecured.test(exchange.getRequest())) {
                
                // 1. Did the user try to sneak in without an Authorization header?
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    System.out.println("ACCESS DENIED: Missing Authorization Header");
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7); // Strip "Bearer "
                }

                // 2. Mathematically prove the token is real and not forged
                try {
                    jwtUtil.validateToken(authHeader);
                    
                    // 2.5 EXTRACT the ClientId and secretly inject it into the request!
                    String clientId = jwtUtil.extractClientId(authHeader);
                    
                    // Modify the HTTP request to add the hidden X-Client-Id header
                    exchange = exchange.mutate()
                            .request(exchange.getRequest().mutate()
                                    .header("X-Client-Id", clientId)
                                    .build())
                            .build();

                } catch (Exception e) {
                    System.out.println("ACCESS DENIED: Invalid or Forged Token! -> " + e.getMessage());
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
            }
            
            // 3. Token is perfect. Let them through the gate!
            return chain.filter(exchange);
        });
    }

    public static class Config {
    }
}
