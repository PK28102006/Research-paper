
import { Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import './styles/layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-container">
        <Sidebar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
