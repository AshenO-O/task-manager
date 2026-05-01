import {useState} from 'react';
import './settings.css';

function Settings() {
    const [fullname, setFullname] = useState('Ashen');
    const [email, setEmail] = useState('induwaradissaratne@gmail.com');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [theme, setTheme] = useState('light');

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        

        alert('Profile updated successfully! (Demo)');
    };

    const handlePasswordChange = (e) => {   // password change handler
        e.preventDefault(); 
        if (newPassword !== confirmPassword) {
            alert('Confirm password do not match!');
            return;
        }
        if (newPassword.length < 6) {     // checking password length
            alert('New password must be at least 6 characters long!');
            return;
        }   

        alert('Password changed successfully!');

        setCurrentPassword('');  // Clear password fields after change
        setNewPassword('');
        setConfirmPassword('');


    };

    return (
    <div className="settings-container">
      <h1>Settings</h1>
      <p className="settings-subtitle">Manage your account and preferences</p>

      // Profile Settings
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
        </form>
      </div>

      // Password Change Section 
      <div className="settings-section">
        <h2>Change Password</h2>
        <p className="section-desc">Update your account password</p>
        
        <form onSubmit={handlePasswordChange}>      
          <div className="input-group">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
          </div>
          
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">
            Change Password
          </button>
        </form>
      </div>

      // Theme Preferences

      <div className="settings-section">
        <h2>Theme Preferences</h2>
        <p className="section-desc">Choose your preferred color theme</p>
        
        <div className="theme-options">
          
          // Light Theme Option

          <label className={`theme-option ${theme === 'light' ? 'selected' : ''}`}>  // it will add 'selected' class to the label if the current theme is light, allowing us to style the selected option differently
            <input
              type="radio"            
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}   
            />
            <div className="theme-preview light-preview">
              <span>Light Mode</span>
              <small>Bright and clean</small>
            </div>
          </label>
          
          // Dark Theme Option
          
          <label className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
            />
            <div className="theme-preview dark-preview">
              <span>Dark Mode</span>
              <small>Easy on the eyes</small>
            </div>
          </label>
        </div>
        
        // Display current theme selection

        <p className="theme-message">
          Current theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        </p>
      </div>
    </div>
  );
}

export default Settings;