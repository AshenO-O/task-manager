package com.taskmanager.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    
    // Secret key for signing tokens
    // In production, move this to environment variables!
    private static final String SECRET = "your-super-secret-key-for-jwt-tokens-make-it-at-least-256-bits-long";
    
    private Key getSigningKey() {
        byte[] keyBytes = SECRET.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    // Generate a token for a user (valid for 24 hours)
    public String generateToken(String userId, String email, String name) {
        return Jwts.builder()
                .setSubject(userId)                    // User ID as subject
                .claim("email", email)                 // Store email in token
                .claim("name", name)                   // Store name in token
                .setIssuedAt(new Date())               // When token was created
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    // Extract user ID from token
    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }
    
    // Extract email from token
    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }
    
    // Extract name from token
    public String extractName(String token) {
        return extractAllClaims(token).get("name", String.class);
    }
    
    // Check if token is valid (not expired and signature is correct)
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}