package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.AuthResponse;
import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.SignupRequest;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    // Create new account
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            User user = authService.signup(request);
            AuthResponse response = new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                "Account created successfully!"
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Login to account
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);
            AuthResponse response = new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                "Login successful!"
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}