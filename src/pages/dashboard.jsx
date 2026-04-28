import { useState } from 'react';

function Dashboard() {
  // State for the task list
  const [tasks, setTasks] = useState([
    { id: 1, title: "Learn React", completed: false },
    { id: 2, title: "Build a project", completed: false },
    { id: 3, title: "Master fullstack", completed: false }
  ]);

  // State for the input field (what user is typing)
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Add a new task
  const addTask = () => {
    
    if (newTaskTitle.trim() === '') return;   // Don't add empty tasks
    
    // Create a new task object
    const newTask = {
      id: Date.now(),  // Unique ID using current timestamp
      title: newTaskTitle,
      completed: false
    };
    
    // Add new task to the existing tasks
    setTasks([...tasks, newTask]);
    
    // Clear the input field
    setNewTaskTitle('');
  };

  // Delete a task
  
  const deleteTask = (idToDelete) => {
    const remainingTasks = tasks.filter((task) => task.id !== idToDelete);    // filter() creates a new array WITHOUT the task we want to delete
    setTasks(remainingTasks);
  };     

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Input and Add Button */}
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      
      <p>You have {tasks.length} tasks</p>
      
      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;