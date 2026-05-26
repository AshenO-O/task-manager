package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.SignupRequest;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;

    private String hashPassword(String password) { 
        // Simple hash for demo 
        return Integer.toHexString(password.hashCode());
    }
    
    // Signup new user
    public User signup(SignupRequest request) throws Exception {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email already in use");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(hashPassword(request.getPassword()));
        user.setCreatedAt(DateTimeFormatter.ISO_INSTANT.format(Instant.now()));
        
        return userRepository.save(user);
    }
    
    // Login user
    public User login(LoginRequest request) throws Exception {
        // Find user by the email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new Exception("Invalid email or password"));
        
        // Check password
        if (!user.getPassword().equals(hashPassword(request.getPassword()))) {
            throw new Exception("Invalid email or password");
        }
        
        return user;
    }
}