import { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import './Dashboard.css';

function Dashboard({ user }) {
  // State for all tasks
  const [tasks, setTasks] = useState([]);
  
  // Loading state (show spinner while fetching)
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the "Add Task" form inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
  // State for filtering and searching
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // This runs when the component loads or when user changes
  useEffect(() => {
    if (user && user.id) {  
      loadTasks();
    }
  }, [user]);

  // Fetch all tasks for current user from backend
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskApi.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  
  // Calculate overdue: tasks not completed AND due date is before today
  const overdueTasks = tasks.filter(task => {
    if (task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;


  // Add a new task
  const addTask = async () => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask = {
      title: newTaskTitle,
      completed: false,
      priority: priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
    };
    
    try {
      const response = await taskApi.createTask(newTask);
      setTasks([...tasks, response.data]);  // Add new task to state
      
      // Clear form
      setNewTaskTitle('');
      setPriority('medium');
      setDueDate('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Check if backend is running.');
    }
  };

  // Delete a task
  const deleteTask = async (idToDelete) => {
    try {
      await taskApi.deleteTask(idToDelete);
      setTasks(tasks.filter(task => task.id !== idToDelete));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  // Toggle task completion (checkbox click)
  const toggleComplete = async (idToToggle) => {
    // Find the task to update
    const taskToUpdate = tasks.find(task => task.id === idToToggle);
    if (!taskToUpdate) return;
    
    // Create updated task with flipped completed status
    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };
    
    try {
      await taskApi.updateTask(idToToggle, updatedTask);
      // Update local state
      setTasks(tasks.map(task =>
        task.id === idToToggle ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  let filteredByStatus = tasks;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (activeFilter === 'active') {
    filteredByStatus = tasks.filter(task => !task.completed);
  } else if (activeFilter === 'completed') {
    filteredByStatus = tasks.filter(task => task.completed);
  } else if (activeFilter === 'overdue') {
    filteredByStatus = tasks.filter(task => {
      if (task.completed) return false;
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    });
  }

  // Filter by search query
  const filteredTasks = filteredByStatus.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Priority badge color helper
  const getPriorityClass = (priority) => {
    if (priority === 'high') return 'priority-high';
    if (priority === 'medium') return 'priority-medium';
    return 'priority-low';
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      
      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name || 'User'}!</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{completedTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{pendingTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue</h3>
          <p className="stat-number">{overdueTasks}</p>
        </div>
      </div>

      {/* QUICK ADD TASK FORM */}
      <div className="quick-add-section">
        <h2>Quick Add Task</h2>
        <div className="add-task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search tasks..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        <button 
          className={activeFilter === 'all' ? 'active' : ''} 
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={activeFilter === 'active' ? 'active' : ''} 
          onClick={() => setActiveFilter('active')}
        >
          Active
        </button>
        <button 
          className={activeFilter === 'completed' ? 'active' : ''} 
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={activeFilter === 'overdue' ? 'active' : ''} 
          onClick={() => setActiveFilter('overdue')}
        >
          Overdue
        </button>
      </div>

      {/* TASK LIST */}
      <div className="task-list-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
            <p className="empty-hint">Add a new task using the form above</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <span className="task-title">{task.title}</span>
              <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>
              <span className="due-date">📅 {task.dueDate}</span>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;