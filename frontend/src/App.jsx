import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PaperProvider } from './context/PaperContext';
import Layout from './Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import SubmitPaper from './pages/papers/SubmitPaper';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import PaperDetails from './pages/papers/PaperDetails';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import LoginRoleSelect from './pages/auth/LoginRoleSelect';
import RegisterRoleSelect from './pages/auth/RegisterRoleSelect';
import AdminLogin from './pages/auth/AdminLogin';
import ManageUsers from './pages/dashboard/ManageUsers';
import Profile from './pages/profile/Profile';
import ReviewPapers from './pages/papers/ReviewPapers';

function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Routes>
          {/* Public Routes */}
          {/* Public Routes (With Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Auth Routes (No Footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginRoleSelect />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register" element={<RegisterRoleSelect />} />
            <Route path="/register/:role" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
          
          {/* Dashboard Routes (Student/Reviewer) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="submit" element={
              <ProtectedRoute roles={['student']}>
                <SubmitPaper />
              </ProtectedRoute>
            } />
            <Route path="reviews" element={
              <ProtectedRoute roles={['reviewer']}>
                <ReviewPapers />
              </ProtectedRoute>
            } />
            <Route path="paper/:id" element={<PaperDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
             <Route index element={<AdminDashboard />} />
             <Route path="users" element={<ManageUsers />} /> 
             <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PaperProvider>
    </AuthProvider>
  );
}

export default App;
