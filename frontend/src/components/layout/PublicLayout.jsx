import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import '../../styles/layout.css';

const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background-color)', color: '#111827' }}>
      <PublicNavbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' }}>
        <Outlet />
      </main>
      <footer style={{ backgroundColor: '#ffffff', color: '#4b5563', padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid #e5e7eb', position: 'relative', zIndex: 10 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#111827', marginBottom: '1rem', fontWeight: '600' }}>Student Journal Portal</div>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Advancing Academic Publication. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
