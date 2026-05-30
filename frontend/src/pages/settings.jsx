import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import './settings.css';

function Settings({ user, theme: initialTheme = 'light', onThemeChange, onLogout }) {
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const [theme, setTheme] = useState(initialTheme);
  const navigate = useNavigate();

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');

    authApi.updateProfile({ name: fullName, email: email })
      .then((res) => {
        setProfileMessage(res.data.message || 'Profile updated successfully');
        // Update localStorage user data
        const updated = { id: res.data.id, name: res.data.name, email: res.data.email };
        localStorage.setItem('user', JSON.stringify(updated));
      })
      .catch((err) => {
        setProfileError(err.response?.data || 'Failed to update profile');
      });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Confirm password does not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error.response?.data || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <p className="settings-subtitle">Manage your account and preferences</p>

      <div className="settings-section">
        <h2>Profile Settings</h2>
        <p className="section-desc">Update your personal information</p>

        <form onSubmit={handleProfileUpdate}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <button type="submit" className="btn-primary">
            Save Changes
          </button>
          {profileError && <div className="error-message">{profileError}</div>}
          {profileMessage && <div className="success-message">{profileMessage}</div>}
        </form>
      </div>

      <div className="settings-section">
        <h2>Change Password</h2>
        <p className="section-desc">Update your account password</p>

        <form onSubmit={handlePasswordChange}>
          <div className="input-group">
            <label>Current Password</label>
            <div className="password-field">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {passwordError && <div className="error-message">{passwordError}</div>}
          {passwordMessage && <div className="success-message">{passwordMessage}</div>}

          <button type="submit" className="btn-primary">
            Change Password
          </button>
        </form>
      </div>

      <div className="settings-section">
        <h2>Theme Preferences</h2>
        <p className="section-desc">Choose your preferred color theme</p>

        <div className="theme-options">
          <label className={`theme-option ${theme === 'light' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={() => handleThemeChange('light')}
            />
            <div className="theme-preview light-preview">
              <span>Light Mode</span>
              <small>Bright and clean</small>
            </div>
          </label>

          <label className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={() => handleThemeChange('dark')}
            />
            <div className="theme-preview dark-preview">
              <span>Dark Mode</span>
              <small>Easy on the eyes</small>
            </div>
          </label>
        </div>

        <p className="theme-message">
          Current theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        </p>
      </div>

      <div className="settings-section logout-section">
        <h2>Session</h2>
        <p className="section-desc">Sign out of your account</p>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;
