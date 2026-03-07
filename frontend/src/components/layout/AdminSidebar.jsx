
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, FileText, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ padding: '0 1rem 1rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
         <h2 style={{ fontSize: '1.25rem', color: '#111827', margin: 0 }}>Admin Portal</h2>
      </div>
      
      <div className="sidebar-links" style={{ flex: 1 }}>
        <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Manage Users</span>
        </NavLink>
        <NavLink to="/admin/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
         {/* Future: Add All Papers view */}
      </div>

       <button onClick={handleLogout} className="sidebar-link" style={{ 
          marginTop: 'auto', border: 'none', background: 'none', cursor: 'pointer', width: '100%', color: '#ef4444' 
       }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
    </aside>
  );
};

export default AdminSidebar;
