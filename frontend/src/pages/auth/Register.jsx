
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../../styles/auth.css';

const Register = () => {
  const { role: paramRole } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: paramRole || 'student', // Default to param or student
    mentor: '' // Mentor name for students
  });
  
  useEffect(() => {
    if (paramRole) {
        setFormData(prev => ({ ...prev, role: paramRole }));
    }
  }, [paramRole]);

  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate(`/login/${formData.role}`);
    } else {
      setError(result.message);
    }
  };

  const getRoleTitle = () => {
      if (formData.role === 'reviewer') return 'Reviewer';
      if (formData.role === 'student') return 'Student';
      return 'Account';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create {getRoleTitle()} Account</h2>
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {formData.role === 'student' && (
             <div className="form-group">
                <label className="form-label">Mentor Name</label>
                <input
                  type="text"
                  name="mentor"
                  className="form-input"
                  value={formData.mentor || ''}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Jane Doe"
                  required
                />
             </div>
          )}
          

          
          {/* Hide role selector if param is present, or show it? Better to show but maybe disabled? 
              Let's keep it simple: Show it, but it defaults to the selection. Users can switch if they clicked wrong. */}
           <div className="form-group">
            <label className="form-label">I am a...</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              disabled={!!paramRole} // Disable if came from selection
              style={{ backgroundColor: paramRole ? '#f9fafb' : 'white' }}
            >
              <option value="student">Student</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          <button type="submit" className="btn-auth btn-primary">
            Register
          </button>
        </form>
         <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
