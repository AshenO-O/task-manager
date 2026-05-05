// Login.jsx - Login page
// First page users see when opening the app

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    
    if (email && password) {
      // Create user object
      const userData = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0] // Use part before @ as name
      };
      
      onLogin(userData);
      navigate('/dashboard');
    } else {
      setError('Please enter email and password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Sign In</button>
        </form>

        <div className="divider">Or continue with</div>

        <div className="social-buttons">
          <button className="btn-social">Google</button>
          <button className="btn-social">GitHub</button>
        </div>

        <p className="signup-link">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;