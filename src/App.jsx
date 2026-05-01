import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Settings from "./pages/settings";
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>TaskFlow</h1>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/login">Login</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </nav>
      <Routes> // Define routes for different pages
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
