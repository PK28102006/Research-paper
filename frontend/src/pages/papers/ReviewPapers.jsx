
import { useState } from 'react';
import { usePapers } from '../../context/PaperContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewPapers = () => {
  const { papers } = usePapers();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Only show papers assigned to this reviewer
  const myAssignedPapers = papers.filter(p => p.reviewerId === user.id);

  // Filter logic
  const filteredPapers = myAssignedPapers.filter(paper => {
    const matchesSearch = 
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paper.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || paper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="review-papers-page">
        <h2 style={{ marginBottom: '2rem' }}>Review Papers</h2>
        
        <div className="recent-papers">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Papers for Review</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input 
                            type="text" 
                            placeholder="Search title or author..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '250px' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Filter size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredPapers.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No papers found.</p>
            ) : (
            <div className="paper-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredPapers.map(paper => (
                <div key={paper.id} style={{
                    backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{paper.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                        Author: {paper.authorName} • Submitted: {new Date(paper.submittedAt).toLocaleDateString()}
                    </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusBadge status={paper.status} />
                    <Link to={`/dashboard/paper/${paper.id}`} className="btn-secondary" style={{
                        padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', textDecoration: 'none', color: '#374151', fontSize: '0.875rem'
                    }}>
                        View Details
                    </Link>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
    </div>
  );
};

export default ReviewPapers;
