
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import '../../styles/layout.css';

const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <PublicNavbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <footer style={{ backgroundColor: '#ffffff', color: '#4b5563', padding: '2rem', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
        <p>&copy; {new Date().getFullYear()} Student Journal Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
