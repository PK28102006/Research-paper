import { usePapers } from '../../context/PaperContext';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/specific/StatsCard';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewerDashboard = () => {
  const { papers } = usePapers();
  const { user } = useAuth();

  // Only show papers assigned to this reviewer
  const myAssignedPapers = papers.filter(p => p.reviewerId === user.id);

  const total = myAssignedPapers.length;
  const pending = myAssignedPapers.filter(p => p.status === 'pending').length;
  const reviewed = myAssignedPapers.filter(p => p.status !== 'pending').length;

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: '2rem' }}>Reviewer Dashboard</h2>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatsCard title="Total Papers" value={total} icon={<FileText size={24} />} color="blue" />
        <StatsCard title="Pending Review" value={pending} icon={<Clock size={24} />} color="yellow" />
        <StatsCard title="Reviewed" value={reviewed} icon={<CheckCircle size={24} />} color="green" />
      </div>

       <div style={{ marginTop: '2rem' }}>
          <p style={{ color: '#6b7280' }}>
            View your assigned papers in the <Link to="/dashboard/reviews" style={{ color: '#2563eb', fontWeight: '500' }}>Review Papers</Link> section.
          </p>
       </div>
    </div>
  );
};

export default ReviewerDashboard;
