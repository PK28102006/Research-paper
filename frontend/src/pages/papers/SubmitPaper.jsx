
import { useState, useEffect } from 'react';
import { usePapers } from '../../context/PaperContext';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

const SubmitPaper = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    pdfName: '', // File name
    pdfData: '', // File contents encoded as base64
    reviewerId: '', // Selected mentor
    projectType: 'Individual',
    teamSize: 1,
    teamMembers: []
  });
  const [reviewers, setReviewers] = useState([]);
  const [loadingReviewers, setLoadingReviewers] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitPaper } = usePapers();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const data = await api.getReviewers();
        setReviewers(data);
      } catch (error) {
        console.error("Failed to load reviewers", error);
      } finally {
        setLoadingReviewers(false);
      }
    };
    fetchReviewers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'projectType') {
      if (value === 'Team') {
        setFormData({ ...formData, projectType: value, teamSize: 2, teamMembers: [{name: '', email: ''}, {name: '', email: ''}] });
      } else {
        setFormData({ ...formData, projectType: value, teamSize: 1, teamMembers: [] });
      }
    } else if (name === 'teamSize') {
      const sizeVal = value === '' ? '' : parseInt(value, 10);
      
      const members = [...formData.teamMembers];
      if (typeof sizeVal === 'number' && !isNaN(sizeVal) && sizeVal >= 1) {
        while (members.length < sizeVal) members.push({ name: '', email: '' });
        while (members.length > sizeVal) members.pop();
      }
      setFormData({ ...formData, teamSize: sizeVal, teamMembers: members });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const members = [...formData.teamMembers];
    members[index][field] = value;
    setFormData({ ...formData, teamMembers: members });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, pdfName: file.name, pdfData: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const result = await submitPaper(formData);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.message || 'Failed to submit paper');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0 3rem' }}>
      <button onClick={() => navigate(-1)} style={{ 
        background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '2rem', padding: 0, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '500', transition: 'color 0.2s'
      }} onMouseOver={(e) => e.target.style.color = '#111827'} onMouseOut={(e) => e.target.style.color = '#6b7280'}>
        <ArrowLeft size={16} /> Back
      </button>
      <h2 style={{ marginBottom: '2.5rem', fontSize: '2rem' }}>Submit New Research Paper</h2>
      <div className="card-professional" style={{ padding: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
             <label className="form-label">Project Type</label>
             <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="form-input"
             >
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
             </select>
          </div>

          {formData.projectType === 'Team' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Total Team Size (min 2, max 4)</label>
                <input
                  type="number"
                  name="teamSize"
                  min="2"
                  max="4"
                  value={formData.teamSize}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              {formData.teamMembers.map((member, index) => (
                <div key={index} style={{ padding: '2rem', backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                    {index === 0 ? 'Team Leader' : `Team Member ${index + 1}`}
                  </h4>
                  <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Paper Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter the title of your paper"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Abstract</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              rows="6"
              className="form-input"
              style={{ resize: 'vertical', minHeight: '120px' }}
              placeholder="Provide a brief summary of your research..."
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
             <label className="form-label">Keywords</label>
             <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Comma separated keywords (e.g., AI, Machine Learning, React)"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
             <label className="form-label">Select Mentor</label>
             <select
              name="reviewerId"
              value={formData.reviewerId}
              onChange={handleChange}
              required
              className="form-input"
             >
                <option value="">-- Choose a Mentor --</option>
                {loadingReviewers ? (
                  <option disabled>Loading mentors...</option>
                ) : (
                  reviewers.map(reviewer => (
                    <option key={reviewer.id} value={reviewer.id}>
                      {reviewer.name}
                    </option>
                  ))
                )}
             </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Upload PDF</label>
            <div style={{ border: '1px dashed var(--accent-color)', padding: '2.5rem', backgroundColor: 'transparent', textAlign: 'center', transition: 'all 0.3s' }}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                required={!formData.pdfName}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Upload size={36} color="var(--primary-color)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                  {formData.pdfName || 'Click to select PDF document'}
                </span>
              </label>
            </div>
          </div>

          {error && <div className="error-message" style={{ color: 'var(--error-color, red)', marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '4px' }}>{error}</div>}
          {success && <div className="success-message" style={{ color: 'var(--success-color, green)', marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(0,255,0,0.1)', border: '1px solid rgba(0,255,0,0.2)', borderRadius: '4px' }}>Paper submitted successfully! Redirecting...</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
             <button type="button" onClick={() => navigate('/dashboard')} className="btn-auth" disabled={isSubmitting} style={{ width: 'auto', padding: '0.875rem 2rem', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid #CCCCCC', marginTop: 0 }}>
               Cancel
             </button>
             <button type="submit" className="btn-auth btn-primary" disabled={isSubmitting} style={{ width: 'auto', padding: '0.875rem 2.5rem', marginTop: 0, boxShadow: 'none', opacity: isSubmitting ? 0.7 : 1 }}>
               {isSubmitting ? 'Submitting...' : 'Submit Paper'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPaper;
