package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.SignupRequest;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;
    
    // BCrypt for secure password hashing
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Signup new user
    public User signup(SignupRequest request) throws Exception {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        
        // Check if email already exists
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new Exception("Email already in use");
        }
        
        // Create new user with ENCRYPTED password
        User user = new User();
        user.setName(request.getName());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash!
        user.setCreatedAt(DateTimeFormatter.ISO_INSTANT.format(Instant.now()));
        
        return userRepository.save(user);
    }
    
    // Login user - returns JWT token instead of user object
    public String login(LoginRequest request) throws Exception {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        
        // Find user by email
        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new Exception("Invalid email or password"));
        
        // Check password using BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new Exception("Invalid email or password");
        }
        
        // Generate and return JWT token
        return jwtService.generateToken(user.getId(), user.getEmail(), user.getName());
    }
    
    // Get user by ID )
    public User getUserById(String id) throws Exception {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new Exception("User not found"));
        user.setPassword(null); // Don't send password to frontend
        return user;
    }
}