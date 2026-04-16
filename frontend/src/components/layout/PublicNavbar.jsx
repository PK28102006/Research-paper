import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus, Menu, X } from 'lucide-react';
import '../../styles/layout.css';
import '../../styles/public.css';

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar public-navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-title public-title">
           <div className="title-icon">
             <BookOpen size={24} strokeWidth={1.5} />
           </div>
           <span className="title-text">Student Journal</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop & Mobile Actions */}
        <div className={`navbar-actions public-actions ${isMenuOpen ? 'open' : ''}`}>
           <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
             Home
           </NavLink>
           <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
             About
           </NavLink>
           
           <div className="nav-divider"></div>
           
           <Link to="/login" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
             <LogIn size={18} /> Login
           </Link>
           <Link to="/register" className="nav-register-btn" onClick={() => setIsMenuOpen(false)}>
             <UserPlus size={18} /> Register
           </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
