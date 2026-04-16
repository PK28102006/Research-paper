
import { Users, Mail, Globe, BookOpen, Shield, Award, Target } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-hero">
          <span className="about-badge">The Standard of Excellence</span>
          <h1 className="about-title">
            Advancing Academic<br/>Discovery
          </h1>
          <p className="about-subtitle">
            The Undergraduate Research Journal Portal is a prestigious digital infrastructure designed to elevate and streamline the publication of elite student research. We believe that rigorous academic inquiry deserves an unparalleled platform to be vetted, discussed, and recognized by distinguished academics globally.
          </p>
        </div>

        <div className="glass-grid">
          <div className="glass-card">
            <div className="card-icon-wrapper">
               <Shield size={32} strokeWidth={1.5} />
            </div>
            <h3 className="card-title">Rigorous Review</h3>
            <p className="card-text">
              Our dual-stage, double-blind peer review process ensures that every manuscript is evaluated with the highest standards of academic integrity and uncompromising scrutiny.
            </p>
          </div>

          <div className="glass-card">
            <div className="card-icon-wrapper">
               <BookOpen size={32} strokeWidth={1.5} />
            </div>
            <h3 className="card-title">Open Access</h3>
            <p className="card-text">
              Transforming student dissertations into globally accessible knowledge. We break down paywalls to foster an inclusive environment for the distribution of scientific discovery.
            </p>
          </div>

          <div className="glass-card">
            <div className="card-icon-wrapper">
               <Award size={32} strokeWidth={1.5} />
            </div>
            <h3 className="card-title">Merit & Distinction</h3>
            <p className="card-text">
              Submissions that display exceptional methodological strength and novel findings are indexed and officially distinguished with our academic seal of excellence.
            </p>
          </div>
        </div>

        <div className="purpose-section" style={{ marginBottom: '8rem', maxWidth: '950px', margin: '0 auto 8rem' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#111827', marginBottom: '2.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center' }}>
            <Target size={36} color="#C5A059" strokeWidth={1.5} />
            The Purpose of Submission
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', color: '#4b5563', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '300' }}>
            The primary objective of this portal is to systematically bridge the gap between student researchers and formal academic publishing. Submitting a manuscript is a critical step toward validating your academic hypotheses and establishing a persistent scholarly record.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3.5rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.15rem', color: '#111827', marginBottom: '1rem', fontWeight: '600' }}>For Scholars & Authors</h4>
              <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>Subject your work to rigorous double-blind evaluation, gain invaluable feedback from expert reviewers, and build a distinguished academic portfolio prior to entering graduate-level studies or industry research.</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.15rem', color: '#111827', marginBottom: '1rem', fontWeight: '600' }}>For the Institution</h4>
              <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>Establish a categorized, persistent repository of institutional excellence. This enables educators and department chairs to identify top-tier talent and properly highlight undergraduate research milestones.</p>
            </div>
          </div>
        </div>

         <div className="directory-section">
           <h2 className="directory-title">Official Global Directories</h2>
           
           <div className="directory-grid">
             <div className="directory-item">
                <div className="dir-icon">
                  <Mail size={24} strokeWidth={1.5} />
                </div>
                <div className="dir-text">
                  <div className="dir-label">Editorial Office</div>
                  <div className="dir-value">editorial@journal.edu</div>
                </div>
             </div>

             <div className="directory-item">
                <div className="dir-icon">
                  <Globe size={24} strokeWidth={1.5} />
                </div>
                <div className="dir-text">
                  <div className="dir-label">Global Portal</div>
                  <div className="dir-value">www.research-portal.edu</div>
                </div>
             </div>

              <div className="directory-item">
                <div className="dir-icon">
                  <Users size={24} strokeWidth={1.5} />
                </div>
                <div className="dir-text">
                  <div className="dir-label">Advisory Board</div>
                  <div className="dir-value">Dr. A. Sterling & Committee</div>
                </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default About;
