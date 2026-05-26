package com.taskmanager.backend.repository;

import com.taskmanager.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email); // Find user by email for login

    boolean existsByEmail(String email); // Check if email is already registered (for signup)
}
