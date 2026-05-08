package com.taskmanager.backend.controller;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController  // Tells Spring: this class handles HTTP requests
@RequestMapping("/api/tasks")  // All endpoints start with /api/tasks
@CrossOrigin(origins = "http://localhost:5173")  // Allow React app to call this API
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    // GET /api/tasks?userId=123 then return all tasks for that user
    @GetMapping
    public List<Task> getTasks(@RequestParam String userId) {
        return taskService.getTasksByUserId(userId);
    }
    
    // GET /api/tasks/{id}
    // Get a single task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/tasks
    // Create a new task
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }
    
    // PUT /api/tasks/{id}
    // Update an existing task
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }
    
    // DELETE /api/tasks/{id}
    // Delete a task
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
    }
}