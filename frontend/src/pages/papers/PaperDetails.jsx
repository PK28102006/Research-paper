
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePapers } from '../../context/PaperContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { FileText, Download, MessageSquare, Check, X, ArrowLeft, AlertTriangle } from 'lucide-react';

const PaperDetails = () => {
  const { id } = useParams();
  const { papers, updatePaper, addComment } = usePapers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const foundPaper = papers.find(p => p.id === id);
    setPaper(foundPaper);
  }, [id, papers]);

  if (!paper) return <div style={{ padding: '2rem', textAlign: 'center' }}>Paper not found</div>;

  const updateStatus = async (status) => {
    const updatedPaper = {
      ...paper,
      status,
      reviewedBy: user.name,
      reviewedAt: new Date().toISOString()
    };
    await updatePaper(updatedPaper);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      await addComment(paper.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ 
        background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '1.5rem'
      }}>
        <ArrowLeft size={18} /> Back
      </button>

      {/* Rejection Alert for Students */}
      {paper.status === 'rejected' && paper.rejectionReason && (
        <div style={{ 
            backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem'
        }}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Paper Rejected</h4>
                <p style={{ margin: 0 }}><strong>Reason:</strong> {paper.rejectionReason}</p>
            </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{paper.title}</h1>
          <StatusBadge status={paper.status} />
        </div>

        <div style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Submitted by <strong>{paper.authorName}</strong> on {new Date(paper.submittedAt).toLocaleDateString()}
          {paper.reviewerName && <span> • Assigned to: <strong>{paper.reviewerName}</strong></span>}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Abstract</h3>
          <p style={{ lineHeight: '1.6', color: '#374151' }}>{paper.abstract}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Keywords</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {paper.keywords?.split(',').map((k, i) => (
              <span key={i} style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', color: '#4b5563' }}>
                {k.trim()}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Project Type</h3>
          <p style={{ margin: 0, fontWeight: '500' }}>
            {paper.projectType || 'Individual'} Project
          </p>
          {paper.projectType === 'Team' && paper.teamMembers && paper.teamMembers.length > 0 && (
            <div style={{ marginTop: '1rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Team Members ({paper.teamSize} total)</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
                <li style={{ marginBottom: '0.25rem' }}>
                    <strong>{paper.authorName}</strong> (Main Student)
                </li>
                {paper.teamMembers.map((member, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    <strong>{member.name}</strong> - {member.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText size={32} color="#9ca3af" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500' }}>{paper.pdfName}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>PDF Document</div>
          </div>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer' 
          }}>
            <Download size={18} /> Download
          </button>
        </div>

      {user.role === 'reviewer' && paper.status === 'pending' && (
           <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
             <button onClick={() => updateStatus('rejected')} style={{ 
               backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
             }}>
               <X size={18} /> Reject
             </button>
             <button onClick={() => updateStatus('approved')} style={{ 
               backgroundColor: '#d1fae5', color: '#059669', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
             }}>
               <Check size={18} /> Approve
             </button>
           </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <MessageSquare size={20} /> Comments
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {paper.comments && paper.comments.length > 0 ? (
            paper.comments.map(comment => (
              <div key={comment.id} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>{comment.authorName}</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ margin: 0, color: '#4b5563' }}>{comment.text}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No comments yet.</p>
          )}
        </div>

        {(user.role === 'reviewer' || user.id === paper.authorId) && (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
            <button type="submit" style={{ 
              backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' 
            }}>
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaperDetails;
