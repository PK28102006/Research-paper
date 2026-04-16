
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../styles/auth.css';

const Login = () => {
  const { role } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        // If visiting a specific login portal and roles don't match, auto-logout
        if (role && user.role !== role) {
            logout();
            return;
        }

        // Otherwise redirect to appropriate dashboard
        if (user.role === 'admin') navigate('/admin', { replace: true });
        else if (user.role === 'reviewer') navigate('/dashboard/reviews', { replace: true });
        else navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, role, logout]);

  // Map route param to display title
  const getRoleTitle = () => {
    switch(role) {
      case 'student': return 'Student';
      case 'reviewer': return 'Reviewer';
      case 'admin': return 'Admin';
      default: return 'Journal Portal';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Use the user object directly from the result
        const user = result.user;
        
        // Check if role matches the portal
        if (role && user.role !== role) {
             // Check if role matches the portal
             // But based on App.jsx:
             // - student -> 'student'
             // - reviewer -> 'reviewer'
             // - admin -> 'admin' (separate page, but handled here just in case)
             
             // If we are on /login/student and user is 'admin', REJECT.
             // If we are on /login/reviewer and user is 'student', REJECT.
             
             // The only exception might be admin overriding, but strict separation is requested.
             
            logout(); // Logout immediately if role mismatch
            setError(`Access Denied: This account is not authorized for the ${getRoleTitle()} portal.`);
            return;
        }

        if (user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (user?.role === 'reviewer') {
             navigate('/dashboard/reviews', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/login" className="auth-back-btn">
        <ArrowLeft size={16} /> Back
      </Link>
      <div className="auth-card">
        <h2 className="auth-title">{getRoleTitle()} Login</h2>
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@university.edu"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-auth btn-primary">
            Sign In
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
