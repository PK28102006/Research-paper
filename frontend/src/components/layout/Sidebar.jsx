
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Users, Upload, User } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const getLinks = () => {
    const links = [
      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }
    ];

    if (user?.role === 'student') {
      links.push({ to: '/dashboard/submit', label: 'Submit Paper', icon: <Upload size={20} /> });
    }

    if (user?.role === 'reviewer') {
      links.push({ to: '/dashboard/reviews', label: 'Review Papers', icon: <FileText size={20} /> });
    }

    links.push({ to: '/dashboard/profile', label: 'Profile', icon: <User size={20} /> });

    return links;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-links">
        {getLinks().map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
