package com.taskmanager.backend.filter;

import com.taskmanager.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Get the Authorization header
        String authHeader = request.getHeader("Authorization");
        
        // Check if header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            
            // If token is valid, extract user info and store in request
            if (jwtService.isTokenValid(token)) {
                String userId = jwtService.extractUserId(token);
                String email = jwtService.extractEmail(token);
                String name = jwtService.extractName(token);
                
                // Store user info in request attributes for controllers to use
                request.setAttribute("userId", userId);
                request.setAttribute("userEmail", email);
                request.setAttribute("userName", name);
            }
        }
        
        // Continue with the request
        filterChain.doFilter(request, response);
    }
}