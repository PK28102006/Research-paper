
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import '../../styles/auth.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        if (user.role === 'admin') {
            navigate('/admin', { replace: true });
        } else {
             // If logged in as something else, auto-logout to allow admin login
            logout();
        }
    }
  }, [user, navigate, logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    const result = await login(email, password);
    if (result.success) {
      if (result.user?.role === 'admin') {
         // Navigation handled by useEffect when user state updates
      } else {
        // Force logout if non-admin tries to login here
        logout();
        setError('Unauthorized: Access restricted to administrators.');
      }
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Link to="/login" className="auth-back-btn">
        <ArrowLeft size={16} /> Back
      </Link>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '50%', marginBottom: '1rem' }}>
                <Shield size={32} color="#0f172a" />
            </div>
            <h2 className="auth-title" style={{ marginBottom: 0 }}>Admin Portal</h2>
        </div>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>
          <button type="submit" className="btn-auth btn-admin">
            Access Dashboard
          </button>
        </form>
         <div className="auth-footer">
          <Link to="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>← Return to Main Portal</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
