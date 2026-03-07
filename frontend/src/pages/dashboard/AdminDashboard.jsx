
import { useState, useEffect } from 'react';
import { usePapers } from '../../context/PaperContext';
import { api } from '../../services/api'; 
import StatsCard from '../../components/specific/StatsCard';
import StatusBadge from '../../components/common/StatusBadge'; 
import { Users, FileText, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { papers } = usePapers();
  const [usersCount, setUsersCount] = useState(0); 
  
  // Search/Filter State
  const [paperSearch, setPaperSearch] = useState('');
  const [paperStatusFilter, setPaperStatusFilter] = useState('all');

  const safePapers = Array.isArray(papers) ? papers : [];

  const totalPapers = safePapers.length;
  const approved = safePapers.filter(p => p.status === 'approved').length;
  const rejected = safePapers.filter(p => p.status === 'rejected').length;
  const pending = safePapers.filter(p => p.status === 'pending').length;

  useEffect(() => {
    // Only fetch user count for stats
    const loadStats = async () => {
      try {
         const usersData = await api.getUsers();
         setUsersCount(Array.isArray(usersData) ? usersData.length : 0);
      } catch (error) {
         console.error("Failed to load stats", error);
      }
    };
    loadStats();
  }, []);

  // Filter Papers
  const filteredPapers = safePapers.filter(paper => {
     const matchesSearch = 
        paper.title.toLowerCase().includes(paperSearch.toLowerCase()) || 
        paper.authorName.toLowerCase().includes(paperSearch.toLowerCase());
     const matchesStatus = paperStatusFilter === 'all' || paper.status === paperStatusFilter;
     return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatsCard title="Total Users" value={usersCount} icon={<Users size={24} />} color="purple" />
        <StatsCard title="Total Papers" value={totalPapers} icon={<FileText size={24} />} color="blue" />
        <StatsCard title="Pending" value={pending} icon={<FileText size={24} />} color="yellow" />
        <StatsCard title="Approved" value={approved} icon={<CheckCircle size={24} />} color="green" />
        <StatsCard title="Rejected" value={rejected} icon={<XCircle size={24} />} color="red" />
      </div>

      <div className="papers-list-section" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Recent Technical Papers</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input 
                            type="text" 
                            placeholder="Search title or author..." 
                            value={paperSearch}
                            onChange={(e) => setPaperSearch(e.target.value)}
                            style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '250px' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Filter size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <select 
                            value={paperStatusFilter} 
                            onChange={(e) => setPaperStatusFilter(e.target.value)}
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

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f3f4f6', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>Title</th>
                            <th style={{ padding: '0.75rem' }}>Author</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                            <th style={{ padding: '0.75rem' }}>Submitted</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPapers.length > 0 ? (
                            filteredPapers.map(paper => (
                            <tr key={paper.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '0.75rem' }}>{paper.title}</td>
                                <td style={{ padding: '0.75rem' }}>{paper.authorName}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <StatusBadge status={paper.status} />
                                </td>
                                <td style={{ padding: '0.75rem' }}>{new Date(paper.submittedAt).toLocaleDateString()}</td>
                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                    <Link to={`/dashboard/paper/${paper.id}`} style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '500' }}>
                                        View
                                    </Link>
                                </td>
                            </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                    No papers found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
