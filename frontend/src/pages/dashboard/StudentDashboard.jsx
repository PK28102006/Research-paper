
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePapers } from '../../context/PaperContext';
import StatsCard from '../../components/specific/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import { FileText, CheckCircle, XCircle, Clock, Search, Filter, Trash2, Edit, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { papers, deletePaper, updatePaper } = usePapers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Edit State
  const [editingPaper, setEditingPaper] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const myPapers = papers.filter(p => p.authorId === user.id);
  
  // Filter logic
  const filteredPapers = myPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || paper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pending = myPapers.filter(p => p.status === 'pending').length;
  const approved = myPapers.filter(p => p.status === 'approved').length;
  const rejected = myPapers.filter(p => p.status === 'rejected').length;

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this paper?')) {
        await deletePaper(id);
    }
  };

  const openEditModal = (paper) => {
    setEditingPaper({ ...paper });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditingPaper({ ...editingPaper, [e.target.name]: e.target.value });
  };

  const handleUpdatePaper = async (e) => {
    e.preventDefault();
    if (editingPaper) {
        await updatePaper(editingPaper);
        setIsEditModalOpen(false);
        setEditingPaper(null);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Welcome, {user.name}</h2>
        <Link to="/dashboard/submit" className="btn-primary" style={{
          backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <FileText size={18} />
          Submit New Paper
        </Link>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatsCard title="Total Submissions" value={myPapers.length} icon={<FileText size={24} />} color="blue" />
        <StatsCard title="Pending" value={pending} icon={<Clock size={24} />} color="yellow" />
        <StatsCard title="Approved" value={approved} icon={<CheckCircle size={24} />} color="green" />
        <StatsCard title="Rejected" value={rejected} icon={<XCircle size={24} />} color="purple" />
      </div>

      <div className="recent-papers">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>My Submissions</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input 
                        type="text" 
                        placeholder="Search title..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
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
                backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
              }}>
                <div>
                   <h4 style={{ margin: '0 0 0.5rem 0' }}>{paper.title}</h4>
                   <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                     Submitted on {new Date(paper.submittedAt).toLocaleDateString()}
                     {paper.reviewerName && <span style={{ marginLeft: '0.5rem' }}>• Reviewer: <strong>{paper.reviewerName}</strong></span>}
                   </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <StatusBadge status={paper.status} />
                    
                    {paper.status === 'pending' && (
                        <>
                            <button 
                                onClick={() => openEditModal(paper)}
                                title="Edit Paper"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(paper.id)}
                                title="Delete Paper"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}

                    <Link to={`/dashboard/paper/${paper.id}`} style={{ textDecoration: 'none', fontSize: '0.875rem', color: '#2563eb' }}>
                        View
                    </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Paper Modal */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', position: 'relative' }}>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <X size={24} />
            </button>
            
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Edit Paper</h3>
            
            <form onSubmit={handleUpdatePaper}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Paper Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={editingPaper?.title || ''} 
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Abstract</label>
                <textarea 
                  name="abstract" 
                  value={editingPaper?.abstract || ''} 
                  onChange={handleEditChange}
                  rows="5"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                 <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Keywords</label>
                 <input
                  type="text"
                  name="keywords"
                  value={editingPaper?.keywords || ''}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
