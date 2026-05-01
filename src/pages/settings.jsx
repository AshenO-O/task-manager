import {useState} from 'react';

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


}