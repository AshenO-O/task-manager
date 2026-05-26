package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.AuthResponse;
import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.SignupRequest;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.service.AuthService;
import com.taskmanager.backend.service.JwtService;
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
    
    @Autowired
    private JwtService jwtService;
    
    // POST /api/auth/signup - Create new account
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
    
    // POST /api/auth/login - Login and receive JWT token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            
            // Return token to frontend
            return ResponseEntity.ok(new LoginResponse(token, "Login successful!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    
    // GET /api/auth/me - Get current user info (requires token in header)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from header
            String token = authHeader.substring(7);
            
            // Get user info from token
            String userId = jwtService.extractUserId(token);
            String email = jwtService.extractEmail(token);
            String name = jwtService.extractName(token);
            
            // Return user info
            return ResponseEntity.ok(new UserResponse(userId, email, name));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
}

// Helper class for login response
class LoginResponse {
    private String token;
    private String message;
    
    public LoginResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
    
    public String getToken() { return token; }
    public String getMessage() { return message; }
}

// Helper class for user response
class UserResponse {
    private String id;
    private String email;
    private String name;
    
    public UserResponse(String id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
    
    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
}