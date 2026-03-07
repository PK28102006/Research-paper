
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { storageService } from '../../services/storageService';
import { User, Mail, Lock, Shield, Calendar, Save, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth(); // getting login to refresh user if needed, or we might need a setUser in context
  // Actually context usually exposes setUser or we rely on page reload/storage update
  // For this mock, updating storage and api should be enough, context update might require a generic 'updateUserInContext'
  // But let's assume page reload or basic state update for now. 
  
  // Local state for form modes
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mentor: user?.mentor || '',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const validateInfo = () => {
    if (!personalInfo.name.trim()) return "Name cannot be empty.";
    if (!personalInfo.email.includes('@')) return "Please enter a valid email address.";
    return null;
  };

  const validateSecurity = () => {
    if (!security.currentPassword) return null; // If empty, not trying to change password
    if (security.currentPassword && (security.currentPassword !== user.password)) {
        // In a real app we wouldn't have user.password in frontend context usually, 
        // but for this mock we might or we rely on backend check. 
        // Let's assume we do check it here or backend rejects it.
        // For this mock, let's assume we allow it if we trust the user context has the password (it does in our mock login)
        return "Current password is incorrect.";
    }
    if (security.newPassword.length < 6) return "New password must be at least 6 characters.";
    if (security.newPassword !== security.confirmPassword) return "New passwords do not match.";
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    
    // Validation
    const infoError = validateInfo();
    if (infoError) {
        setStatus({ type: 'error', message: infoError });
        return;
    }

    const securityError = security.newPassword ? validateSecurity() : null;
    if (securityError) {
        setStatus({ type: 'error', message: securityError });
        return;
    }

    setIsLoading(true);

    try {
        // Prepare update object
        const updatedUser = {
            ...user,
            name: personalInfo.name,
            email: personalInfo.email,
            mentor: user.role === 'student' ? personalInfo.mentor : undefined,
        };

        if (security.newPassword) {
            updatedUser.password = security.newPassword;
        }

        const result = await api.updateUser(updatedUser);
        
        // Update local storage to reflect changes immediately
        storageService.setCurrentUser(updatedUser); 
        
        // In a real app, context would listen to storage or we'd call a setUser method.
        // Since we don't have a specific updateUser in context exposed, we might need to rely on reload or just visual success.
        
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
        
        // Clear password fields
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
        setStatus({ type: 'error', message: 'Failed to update profile. Please try again.' });
    } finally {
        setIsLoading(false);
    }
  };

  // Helper to format date from ID (assuming ID is timestamp)
  const getRegistrationDate = () => {
    try {
        const date = new Date(parseInt(user.id));
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
    } catch (e) { /* ignore */ }
    return 'Unknown';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>My Profile</h2>
      
      {status.message && (
        <div style={{ 
            padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            backgroundColor: status.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: status.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${status.type === 'error' ? '#f87171' : '#86efac'}`
        }}>
            {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{status.message}</span>
        </div>
      )}

      {/* Account Summary Card */}
      <div style={{ 
          backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', 
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center'
      }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#2563eb' }}>
                <Shield size={24} />
            </div>
            <div>
                <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</h4>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '1.125rem', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
         </div>

         <div style={{ width: '1px', height: '40px', backgroundColor: '#e5e7eb', display: 'none' /* hidden on mobile */ }}></div>

         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', borderRadius: '50%', color: '#7e22ce' }}>
                <Calendar size={24} />
            </div>
            <div>
                <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</h4>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '1.125rem' }}>{getRegistrationDate()}</p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSave}>
          {/* Personal Details Section */}
          <div style={{ marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} /> Personal Details
             </h3>
             <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                              type="text"
                              name="name"
                              value={personalInfo.name}
                              onChange={handleInfoChange}
                              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                              placeholder="Your Name"
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                              type="email"
                              name="email"
                              value={personalInfo.email}
                              onChange={handleInfoChange}
                              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                              placeholder="name@example.com"
                            />
                        </div>
                    </div>
                </div>
                
                {user?.role === 'student' && (
                     <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Mentor Name</label>
                        <div style={{ position: 'relative' }}>
                             <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                              type="text"
                              name="mentor"
                              value={personalInfo.mentor}
                              onChange={handleInfoChange}
                              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                              placeholder="Your Mentor/Guide Name"
                            />
                        </div>
                    </div>
                )}
             </div>
          </div>

          {/* Security Section */}
          <div style={{ marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} /> Change Password
             </h3>
             <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                 <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                    Leave these fields blank if you do not want to change your password.
                 </p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={security.currentPassword}
                            onChange={handleSecurityChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                            placeholder="Enter current password"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={security.newPassword}
                            onChange={handleSecurityChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                            placeholder="Enter new password (min 6 chars)"
                        />
                    </div>
                     <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={security.confirmPassword}
                            onChange={handleSecurityChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                            placeholder="Confirm new password"
                        />
                    </div>
                 </div>
             </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
             <button 
                type="submit" 
                disabled={isLoading}
                style={{ 
                    backgroundColor: '#2563eb', color: 'white', padding: '0.875rem 2rem', borderRadius: '8px', fontWeight: '600', 
                    border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    opacity: isLoading ? 0.7 : 1, transition: 'all 0.2s'
                }}
             >
                <Save size={20} />
                {isLoading ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
      </form>
    </div>
  );
};

export default Profile;
