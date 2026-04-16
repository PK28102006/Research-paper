
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const LoginRoleSelect = () => {
  const { user, logout } = useAuth();

  // If user visits the role selection page, assume they want to switch accounts or re-login.
  // Auto-logout if a session is active to prevent "stuck in redirect loop" issues.
  useEffect(() => {
    if (user) {
      logout();
    }
  }, [user, logout]);
  return (
    <div className="auth-container">
      <Link to="/" className="auth-back-btn">
        <ArrowLeft size={16} /> Back
      </Link>
      <div className="auth-card role-selection-container">
        <h2 className="auth-title">Select Your Role</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Please choose how you want to log in to the portal.</p>
        
        <div className="role-grid">
          
          <Link to="/login/student" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="role-card">
              <div className="role-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <User size={40} />
              </div>
              <h3 className="role-title">Student</h3>
              <p className="role-description">Submit your research, track status, and view publications.</p>
            </div>
          </Link>

          <Link to="/login/reviewer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="role-card">
              <div className="role-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <BookOpen size={40} />
              </div>
              <h3 className="role-title">Reviewer</h3>
              <p className="role-description">Review student submissions and provide academic feedback.</p>
            </div>
          </Link>

        </div>
        
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
          </p>
          <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <Link to="/admin/login" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRoleSelect;
