// recieving tasks as a prop and display them

function TaskList() {
    const tasks = [
        { id: 1, title: "Lear React", completed: false},
        { id: 2, title: "Building task manager", completed: false},
        { id: 3, title: "Connect to Spring Boot", completed: false},
    ];

    return (
        <div className="task-list">
        <h2>Your Tasks</h2>
        <ul>
            {tasks.map((task) => (
            <li key={task.id}>
                <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.title}
                </span>
            </li>
            ))}
        </ul>
        </div>
    );
}

export default TaskList;