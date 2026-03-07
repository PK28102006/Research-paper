
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../../styles/layout.css';

const AdminLayout = () => {
  return (
    <div className="app-layout">
      {/* Admin might not need the top Navbar if Sidebar has title/logout, or can reuse it with different context */}
      <div className="main-container">
        <AdminSidebar />
        <main className="content-area" style={{ backgroundColor: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
