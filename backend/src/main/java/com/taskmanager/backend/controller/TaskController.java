package com.taskmanager.backend.controller;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.service.JwtService;
import com.taskmanager.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private JwtService jwtService;
    
    // Helper method to get userId from Authorization header
    private String getUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        return jwtService.extractUserId(token);
    }
    
    // GET /api/tasks - Get all tasks for logged in user (NO userId param needed!)
    @GetMapping
    public List<Task> getTasks(@RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromToken(authHeader);
        return taskService.getTasksByUserId(userId);
    }
    
    // GET /api/tasks/{id} - Get a single task by ID
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromToken(authHeader);
        Task task = taskService.getTaskById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Security: Only return task if it belongs to the user
        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return task;
    }
    
    // POST /api/tasks - Create a new task
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@RequestBody Task task, @RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromToken(authHeader);
        task.setUserId(userId); // Automatically set userId from token!
        return taskService.createTask(task);
    }
    
    // PUT /api/tasks/{id} - Update an existing task
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task task, 
                          @RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromToken(authHeader);
        
        // Verify task belongs to user
        Task existingTask = taskService.getTaskById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!existingTask.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        task.setUserId(userId);
        return taskService.updateTask(id, task);
    }
    
    // DELETE /api/tasks/{id} - Delete a task
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromToken(authHeader);
        
        // Verify task belongs to user
        Task existingTask = taskService.getTaskById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!existingTask.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        taskService.deleteTask(id);
    }
}