import { Link } from 'react-router-dom';
import { User, BookOpen, ArrowLeft } from 'lucide-react';
import '../../styles/auth.css';

const RegisterRoleSelect = () => {
  return (
    <div className="auth-container">
      <Link to="/" className="auth-back-btn">
        <ArrowLeft size={16} /> Back
      </Link>
      <div className="auth-card role-selection-container">
        <h2 className="auth-title">Join Our Community</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Choose your role to get started.</p>
        
        <div className="role-grid">
          
          <Link to="/register/student" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="role-card">
              <div className="role-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <User size={40} />
              </div>
              <h3 className="role-title">Student</h3>
              <p className="role-description">Submit research, track progress, and build your academic portfolio.</p>
            </div>
          </Link>

          <Link to="/register/reviewer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="role-card">
              <div className="role-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <BookOpen size={40} />
              </div>
              <h3 className="role-title">Reviewer</h3>
              <p className="role-description">Review papers, provide feedback, and contribute to academic excellence.</p>
            </div>
          </Link>

        </div>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterRoleSelect;
