// Login.jsx - Login page with demo authentication
// For now, we use demo accounts. Later we'll add real backend auth.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Demo users 
const DEMO_USERS = [
  { id: "1", email: "ashen@example.com", password: "123456", name: "Ashen" },
  { id: "2", email: "demo@example.com", password: "123456", name: "Demo User" },
];

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user in demo list
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (user) {
      // Create user object (without password)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      
      onLogin(userData);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Try: ashen@example.com / 123456');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

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

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">Or continue with</div>

        <div className="social-buttons">
          <button className="btn-social">Google</button>
          <button className="btn-social">GitHub</button>
        </div>

        <p className="signup-link">
          Don't have an account? <a href="#">Sign up</a>
        </p>
        
        <p className="demo-hint">
          Demo accounts: ashen@example.com / 123456
        </p>
      </div>
    </div>
  );
}

export default Login;