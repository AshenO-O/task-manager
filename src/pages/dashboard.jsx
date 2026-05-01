import { useState } from 'react';
import './dashboard.css';

function Dashboard() {  
  // State for storing all tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project", completed: false, priority: "high", dueDate: "2026-05-15" },
    { id: 2, title: "Master React", completed: false, priority: "medium", dueDate: "2026-05-10" },
    { id: 3, title: "Review documentation", completed: true, priority: "low", dueDate: "2026-05-08" },
  ]);

  // State for the "Add Task" form inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');    
  const [priority, setPriority] = useState('medium');      
  const [dueDate, setDueDate] = useState('');               

  // State for filtering and searching
  const [activeFilter, setActiveFilter] = useState('all');   
  const [searchQuery, setSearchQuery] = useState('');        
  
  // Calculate stats - counts tasks in different categories
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  
  // Calculate overdue: tasks that are not completed AND due date is before today
  const overdueTasks = tasks.filter(task => {
    if (task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;


  // Add a new task
  const addTask = () => {
    // Don't add empty tasks
    if (newTaskTitle.trim() === '') return;
    
    // Create new task object
    const newTask = {
      id: Date.now(),                        
      title: newTaskTitle,
      completed: false,
      priority: priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0]  // Use today if no date
    };
    
    // Add to existing tasks array
    setTasks([...tasks, newTask]);
    
    // Clear the form
    setNewTaskTitle('');
    setPriority('medium');
    setDueDate('');
  };

  // Delete a task by its ID
  const deleteTask = (idToDelete) => {
    const remainingTasks = tasks.filter(task => task.id !== idToDelete);
    setTasks(remainingTasks);
  };

  // Toggle task completion
  const toggleComplete = (idToToggle) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === idToToggle) {
        // Flip the completed value: true becomes false, false becomes true
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // ========== FILTERING LOGIC ==========

  // First, filter by status (All, Active, Completed, Overdue)
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

  // Then, filter by search query
  const filteredTasks = filteredByStatus.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityClass = (priority) => {
    if (priority === 'high') return 'priority-high';
    if (priority === 'medium') return 'priority-medium';
    return 'priority-low';
  };


  return (
    <div className="dashboard">
      
      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome back, ashen!</p>
      </div>

      {/* STATS CARDS - Shows 4 cards with task counts */}
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

      {/* TASK LIST - Shows all filtered tasks */}
      <div className="task-list-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
            <p className="empty-hint">Add a new task using the form above</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              
              {/* Task Title */}
              <span className="task-title">{task.title}</span>
              
              {/* Priority Badge */}
              <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>
              
              {/* Due Date */}
              <span className="due-date">📅 {task.dueDate}</span>
              
              {/* Delete Button */}
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