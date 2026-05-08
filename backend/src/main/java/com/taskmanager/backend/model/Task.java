package com.taskmanager.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// @Document tells MongoDB: store this in "tasks" collection
@Document(collection = "tasks")
public class Task {
    
    @Id
    private String id;           // Unique ID (MongoDB generates automatically)
    private String title;        
    private boolean completed;   
    private String priority;     
    private String dueDate;     
    private String userId;       // Which user owns this task (for authentication)
    
    public Task() {}
    
    // Constructor with all fields
    public Task(String title, boolean completed, String priority, String dueDate, String userId) {
        this.title = title;
        this.completed = completed;
        this.priority = priority;
        this.dueDate = dueDate;
        this.userId = userId;
    }
    
    // GETTERS AND SETTERS
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public boolean isCompleted() {
        return completed;
    }
    
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public String getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}