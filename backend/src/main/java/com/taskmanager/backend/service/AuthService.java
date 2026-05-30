package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.SignupRequest;
import com.taskmanager.backend.dto.ChangePasswordRequest;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.dto.UpdateProfileRequest;
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

    // Change password for the currently authenticated user
    public void changePassword(String userId, ChangePasswordRequest request) throws Exception {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new Exception("New password and confirm password do not match");
        }
        if (request.getNewPassword().length() < 6) {
            throw new Exception("New password must be at least 6 characters");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new Exception("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    // Update profile (name and email) for authenticated user
    public User updateProfile(String userId, UpdateProfileRequest request) throws Exception {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        // If the email exists and belongs to another user, reject
        if (userRepository.existsByEmail(normalizedEmail)) {
            User existing = userRepository.findByEmail(normalizedEmail).orElse(null);
            if (existing != null && !existing.getId().equals(userId)) {
                throw new Exception("Email already in use");
            }
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));

        user.setName(request.getName());
        user.setEmail(normalizedEmail);

        return userRepository.save(user);
    }
    
    // Get user by ID )
    public User getUserById(String id) throws Exception {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new Exception("User not found"));
        user.setPassword(null); // Don't send password to frontend
        return user;
    }
}