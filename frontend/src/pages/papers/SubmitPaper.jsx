
import { useState, useEffect } from 'react';
import { usePapers } from '../../context/PaperContext';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { api } from '../../services/api';

const SubmitPaper = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    pdfName: '', // Mock PDF upload
    reviewerId: '', // Selected mentor
    projectType: 'Individual',
    teamSize: 1,
    teamMembers: []
  });
  const [reviewers, setReviewers] = useState([]);
  const [loadingReviewers, setLoadingReviewers] = useState(true);

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
        setFormData({ ...formData, projectType: value, teamSize: 2, teamMembers: [{name: '', email: ''}] });
      } else {
        setFormData({ ...formData, projectType: value, teamSize: 1, teamMembers: [] });
      }
    } else if (name === 'teamSize') {
      const sizeVal = value === '' ? '' : parseInt(value, 10);
      
      const members = [...formData.teamMembers];
      if (typeof sizeVal === 'number' && !isNaN(sizeVal) && sizeVal >= 1) {
        // adjust members array to size - 1
        while (members.length < sizeVal - 1) members.push({ name: '', email: '' });
        while (members.length > sizeVal - 1) members.pop();
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
    // Mock file handling - just storing the name
    if (e.target.files[0]) {
      setFormData({ ...formData, pdfName: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await submitPaper(formData);
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Submit New Research Paper</h2>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Project Type</label>
             <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
             >
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
             </select>
          </div>

          {formData.projectType === 'Team' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Team Size (including you, max 4)</label>
                <input
                  type="number"
                  name="teamSize"
                  min="2"
                  max="4"
                  value={formData.teamSize}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>

              {formData.teamMembers.map((member, index) => (
                <div key={index} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ margin: '0 0 1rem 0' }}>Team Member {index + 1}</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Paper Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              placeholder="Enter the title of your paper"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Abstract</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              rows="6"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              placeholder="Provide a brief summary of your research..."
            />
          </div>

          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Keywords</label>
             <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              placeholder="Comma separated keywords (e.g., AI, Machine Learning, React)"
            />

          </div>

          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Mentor</label>
             <select
              name="reviewerId"
              value={formData.reviewerId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
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

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Upload PDF</label>
            <div style={{ border: '2px dashed #d1d5db', padding: '2rem', borderRadius: '6px', textAlign: 'center', cursor: 'pointer' }}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                required={!formData.pdfName} // Required only if not already "uploaded"
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={32} color="#9ca3af" />
                <span style={{ color: '#4b5563' }}>{formData.pdfName || 'Click to upload PDF file'}</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
             <button type="button" onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer' }}>
               Cancel
             </button>
             <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: '500', cursor: 'pointer' }}>
               Submit Paper
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPaper;
