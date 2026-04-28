import { useState } from 'react';  // Import the useState hook

function Dashboard() {

  // useState creates memory for our tasks

  const [tasks, setTasks] = useState([
    { id: 1, title: "Learn React", completed: false },
    { id: 2, title: "Build a project", completed: false },
    { id: 3, title: "Master fullstack", completed: false }
  ]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Display the number of tasks */}
      <p>You have {tasks.length} tasks</p>
      
      {/* List all tasks */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;