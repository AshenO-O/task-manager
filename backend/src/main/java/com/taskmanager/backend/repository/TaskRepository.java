package com.taskmanager.backend.repository;

import com.taskmanager.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

// This interface gives you automatic database operations for Task objects
public interface TaskRepository extends MongoRepository<Task, String> {
    
    // Custom method: Find all tasks for a specific user
    // Spring Data MongoDB automatically implements this based on the method name
    List<Task> findByUserId(String userId);
    
}