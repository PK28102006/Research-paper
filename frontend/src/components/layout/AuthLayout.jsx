import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const AuthLayout = () => {
  // No auto-logout here. If user is logged in, Login page should handle redirection.
  // This prevents race conditions where logging in triggers layout re-render which triggers logout.
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <PublicNavbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
