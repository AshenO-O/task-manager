import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/Signup';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import './App.css';

function App() {
  // Track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // Check if user was logged in before (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Login function - called from Login page
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function - called from Settings page
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('tasks'); // Clear tasks on logout
  };

  return (
    <div className={`app ${theme}`}>
      {/* Only show navbar if user is logged in */}
      {isAuthenticated && (
        <nav className="navbar">
            <div className="nav-brand">
              TaskFlow
            </div>
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/settings">Settings</Link>
              {/* No Login link here anymore */}
            </div>
          </nav>
        )}

        <Routes>
          {/* Login route - if already logged in, go to dashboard */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
            } 
          />

          {/* Signup route - if already logged in, go to dashboard */}
          <Route 
            path="/signup"
            element={<Signup />}
          />
          
          {/* Dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          {/* Settings route */}
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? 
              <Settings user={user} theme={theme} onThemeChange={setTheme} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
  );
}

export default App;