
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePapers } from '../../context/PaperContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { FileText, Download, MessageSquare, Check, X, ArrowLeft, AlertTriangle } from 'lucide-react';

const PaperDetails = () => {
  const { id } = useParams();
  const { papers, addComment, updatePaperStatus } = usePapers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState('');

  useEffect(() => {
    const foundPaper = papers.find(p => p.id === id);
    setPaper(foundPaper);
  }, [id, papers]);

  if (!paper) return <div style={{ padding: '2rem', textAlign: 'center' }}>Paper not found</div>;

  const updateStatus = async (status) => {
    let reason = null;
    if (status === 'rejected') {
      if (rejectReasonText.trim() === '') {
        alert("A rejection reason is required.");
        return;
      }
      reason = rejectReasonText;
    }
    
    await updatePaperStatus(paper.id, status, reason);
    setShowRejectInput(false);
    setRejectReasonText('');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      await addComment(paper.id, commentText);
      setCommentText('');
    }
  };

  const handleDownload = () => {
    if (paper.pdfData) {
      // Download actual uploaded file
      const element = document.createElement("a");
      element.href = paper.pdfData;
      element.download = paper.pdfName || 'downloaded_paper.pdf';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // Fallback for older legacy papers that only mocked upload
      const content = `Title: ${paper.title}\nAuthor: ${paper.authorName}\nDate: ${new Date(paper.submittedAt).toLocaleDateString()}\n\nAbstract:\n${paper.abstract}\n\nKeywords: ${paper.keywords}`;
      const file = new Blob([content], { type: 'text/plain' });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(file);
      
      let dlName = paper.pdfName || 'paper.txt';
      if (dlName.toLowerCase().endsWith('.pdf')) {
        dlName = dlName.substring(0, dlName.length - 4) + '.txt';
      }
      
      element.download = dlName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0', animation: 'fadeIn 0.5s ease' }}>
      <button onClick={() => navigate(-1)} style={{ 
        background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', padding: 0, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '500', transition: 'color var(--transition-fast)'
      }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Rejection Alert for Students */}
      {paper.status === 'rejected' && paper.rejectionReason && (
        <div style={{ 
            backgroundColor: 'var(--primary-light)', borderLeft: '4px solid var(--error-color)', color: 'var(--accent-color)', padding: '1.5rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '2.5rem',
            display: 'flex', alignItems: 'flex-start', gap: '1rem', boxShadow: 'var(--shadow-sm)'
        }}>
            <AlertTriangle size={24} color="var(--error-color)" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
            <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '1.1rem', color: 'var(--error-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission Rejected</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}><strong style={{ color: 'var(--accent-color)' }}>Reviewer Feedback:</strong> {paper.rejectionReason}</p>
            </div>
        </div>
      )}

      <div className="card-professional" style={{ padding: '3.5rem', marginBottom: '3rem', borderTop: '4px solid var(--primary-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--accent-color)', lineHeight: '1.2', flex: 1, paddingRight: '2rem' }}>{paper.title}</h1>
          <div style={{ marginTop: '0.5rem' }}><StatusBadge status={paper.status} /></div>
        </div>

        <div style={{ marginBottom: '2.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
             <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Author</span>
             <strong style={{ color: 'var(--accent-color)' }}>{paper.authorName}</strong>
          </div>
          <div>
             <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Submitted</span>
             <strong style={{ color: 'var(--accent-color)' }}>{new Date(paper.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </div>
          {paper.reviewerName && (
            <div>
               <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Assigned Reviewer</span>
               <strong style={{ color: 'var(--accent-color)' }}>{paper.reviewerName}</strong>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>Abstract</h3>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.05rem', textAlign: 'justify' }}>{paper.abstract}</p>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', fontFamily: 'Inter, sans-serif', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Keywords</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {paper.keywords?.split(',').map((k, i) => (
              <span key={i} style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)', padding: '0.4rem 1rem', borderRadius: 'var(--border-radius)', fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                {k.trim()}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', fontFamily: 'Inter, sans-serif', fontWeight: '600', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Configuration</h3>
          <p style={{ margin: 0, fontWeight: '500', color: 'var(--primary-color)' }}>
            ▪ {paper.projectType || 'Individual'} Project Type Selected
          </p>
          {paper.projectType === 'Team' && paper.teamMembers && paper.teamMembers.length > 0 && (
            <div style={{ marginTop: '1.5rem', backgroundColor: 'var(--background-color)', padding: '1.5rem', borderRadius: 'var(--border-radius-sm)', borderLeft: '2px solid var(--primary-color)' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Team Roster ({paper.teamSize} capacity)</h4>
              <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', color: 'var(--text-secondary)' }}>
                <li style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--accent-color)' }}>{paper.authorName}</strong> 
                    <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '99px' }}>Main Author</span>
                </li>
                {paper.teamMembers.map((member, i) => (
                  <li key={i} style={{ marginBottom: i !== paper.teamMembers.length - 1 ? '0.75rem' : '0', paddingBottom: i !== paper.teamMembers.length - 1 ? '0.75rem' : '0', borderBottom: i !== paper.teamMembers.length - 1 ? '1px dashed var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--accent-color)' }}>{member.name}</strong> 
                    <span style={{ color: 'var(--text-muted)' }}>{member.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ padding: '2rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'all var(--transition-fast)', flexWrap: 'wrap' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
             <FileText size={28} color="var(--primary-color)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: 'var(--accent-color)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{paper.pdfName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attached Manuscript File</div>
          </div>
          <button onClick={handleDownload} style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--accent-color)', background: 'var(--accent-color)', color: 'white', cursor: 'pointer', fontWeight: '500', transition: 'all var(--transition-fast)'
          }} onMouseOver={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-color)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'var(--accent-color)'; e.currentTarget.style.color = 'white'; }}>
            <Download size={18} /> Secure Download
          </button>
        </div>

      {user.role === 'reviewer' && paper.status === 'pending' && (
           <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
             
             {!showRejectInput ? (
               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                 <button onClick={() => setShowRejectInput(true)} style={{ 
                   backgroundColor: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--border-color)', padding: '0.875rem 2rem', borderRadius: 'var(--border-radius)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all var(--transition-fast)'
                 }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--error-color)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                   <X size={18} /> Deny Validation
                 </button>
                 <button onClick={() => updateStatus('approved')} style={{ 
                   backgroundColor: 'var(--primary-color)', color: 'white', border: '1px solid var(--primary-color)', padding: '0.875rem 2rem', borderRadius: 'var(--border-radius)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all var(--transition-fast)'
                 }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; e.currentTarget.style.borderColor = 'var(--primary-hover)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; }}>
                   <Check size={18} /> Approve Manuscript
                 </button>
               </div>
             ) : (
               <div style={{ backgroundColor: 'var(--background-color)', padding: '2rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', animation: 'fadeIn 0.3s ease' }}>
                 <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-color)', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }}>
                   Specify Rejection Reason
                 </h4>
                 <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                   Please provide detailed feedback explaining the manuscript's denial. This will be transmitted directly to the student author to assist in their academic progress.
                 </p>
                 <textarea 
                   value={rejectReasonText}
                   onChange={(e) => setRejectReasonText(e.target.value)}
                   placeholder="Enter formal rejection feedback here..."
                   style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', outline: 'none', transition: 'border-color var(--transition-fast)', fontSize: '0.95rem', backgroundColor: 'var(--surface-color)', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}
                   onFocus={(e) => e.target.style.borderColor = 'var(--error-color)'}
                   onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                 />
                 <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                   <button onClick={() => { setShowRejectInput(false); setRejectReasonText(''); }} style={{ 
                     backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '0.75rem 1.5rem', borderRadius: 'var(--border-radius)', fontWeight: '500', cursor: 'pointer', transition: 'all var(--transition-fast)'
                   }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                     Cancel
                   </button>
                   <button onClick={() => updateStatus('rejected')} style={{ 
                     backgroundColor: 'var(--error-color)', color: 'white', border: '1px solid var(--error-color)', padding: '0.75rem 1.5rem', borderRadius: 'var(--border-radius)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all var(--transition-fast)'
                   }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                     <X size={18} /> Confirm Rejection
                   </button>
                 </div>
               </div>
             )}
             
           </div>
        )}
      </div>

      <div className="card-professional" style={{ padding: '3.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', fontSize: '1.75rem', color: 'var(--accent-color)' }}>
          <MessageSquare size={24} color="var(--primary-color)" /> Official Correspondence
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          {paper.comments && paper.comments.length > 0 ? (
            paper.comments.map(comment => (
              <div key={comment.id} style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--accent-color)', fontSize: '1.05rem' }}>{comment.authorName || comment.reviewerName || 'Reviewer'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{new Date(comment.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{comment.text}</p>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--background-color)', borderRadius: 'var(--border-radius-sm)', border: '1px dashed var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No correspondence has been initiated on this manuscript yet.</p>
            </div>
          )}
        </div>

        {(user.role === 'reviewer' || user.id === paper.authorId) && (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
               <input
                 type="text"
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 placeholder="Draft a new correspondence message..."
                 style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', outline: 'none', transition: 'border-color var(--transition-fast)', fontSize: '0.95rem', backgroundColor: 'var(--background-color)' }}
                 onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                 onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
               />
            </div>
            <button type="submit" style={{ 
              backgroundColor: 'var(--accent-color)', color: 'white', border: '1px solid var(--accent-color)', padding: '1rem 2rem', borderRadius: 'var(--border-radius)', fontWeight: '600', cursor: 'pointer', transition: 'all var(--transition-fast)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem'
            }} onMouseOver={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--accent-color)'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'var(--accent-color)'; e.target.style.color = 'white'; }}>
              Deliver Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaperDetails;
