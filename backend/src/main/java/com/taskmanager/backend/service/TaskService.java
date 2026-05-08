package com.taskmanager.backend.service;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service  // Tells Spring: this is a service class
public class TaskService {
    
    @Autowired  // Tells Spring to automatically inject the repository
    private TaskRepository taskRepository;
    
    // Get all tasks for a specific user
    public List<Task> getTasksByUserId(String userId) {
        return taskRepository.findByUserId(userId);
    }
    
    // Get a single task by ID
    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }
    
    // Create a new task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
    
    // Update an existing task
    public Task updateTask(String id, Task taskDetails) {
        // Find the existing task
        Task existingTask = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        // Update the fields
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setCompleted(taskDetails.isCompleted());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setDueDate(taskDetails.getDueDate());
        existingTask.setUserId(taskDetails.getUserId());
        
        // Save and return the updated task
        return taskRepository.save(existingTask);
    }
    
    // Delete a task
    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }
    
    // Delete all tasks for a user (useful when user deletes account)
    public void deleteTasksByUserId(String userId) {
        List<Task> userTasks = taskRepository.findByUserId(userId);
        taskRepository.deleteAll(userTasks);
    }
}