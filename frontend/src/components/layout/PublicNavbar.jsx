
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';
import '../../styles/layout.css'; 

const PublicNavbar = () => {
  return (
    <nav className="navbar" style={{ padding: '0.75rem 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="navbar-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Link to="/" className="navbar-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', fontSize: '1.25rem' }}>
           <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '8px', color: '#2563eb' }}>
             <BookOpen size={24} />
           </div>
           <span style={{ fontWeight: '700', color: '#111827' }}>Student Journal</span>
        </Link>
        <div className="navbar-actions" style={{ gap: '1.5rem' }}>
           <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={({ isActive }) => ({ 
             color: isActive ? '#2563eb' : '#4b5563', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' 
           })}>
             Home
           </NavLink>
           <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={({ isActive }) => ({ 
             color: isActive ? '#2563eb' : '#4b5563', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' 
           })}>
             About
           </NavLink>
           
           <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb' }}></div>
           
           <Link to="/login" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', color: '#4b5563', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'
           }} onMouseOver={(e) => e.target.style.color = '#111827'} onMouseOut={(e) => e.target.style.color = '#4b5563'}>
             <LogIn size={18} /> Login
           </Link>
           <Link to="/register" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '50px', backgroundColor: '#2563eb', color: 'white', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
           }}>
             <UserPlus size={18} /> Get Started
           </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
