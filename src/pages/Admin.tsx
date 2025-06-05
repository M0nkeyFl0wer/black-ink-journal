
import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if admin is already logged in
    const loggedIn = localStorage.getItem('admin_logged_in');
    const savedUsername = localStorage.getItem('admin_username');
    
    if (loggedIn === 'true' && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  if (isLoggedIn) {
    return <AdminDashboard username={username} onLogout={handleLogout} />;
  }

  return <AdminLogin onLogin={handleLogin} />;
};

export default Admin;
