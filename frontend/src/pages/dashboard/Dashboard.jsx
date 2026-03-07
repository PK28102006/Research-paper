
import { useAuth } from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import ReviewerDashboard from './ReviewerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'reviewer':
      return <ReviewerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Unknown Role</div>;
  }
};

export default Dashboard;
