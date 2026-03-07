import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Users } from 'lucide-react';
import '../../styles/public.css';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Publish Your Research with Confidence</h1>
        <p className="hero-subtitle">
          A streamlined platform for students to submit, review, and publish their academic journal papers. 
          Join a community of scholars today.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-hero btn-hero-primary">
            Get Started
          </Link>
          <Link to="/about" className="btn-hero btn-hero-secondary">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Portal?</h2>
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <FileText size={36} />
            </div>
            <h3 className="feature-title">Easy Submission</h3>
            <p className="feature-desc">Intuitive interface for students to submit their research papers, abstracts, and manuscripts in PDF format.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <CheckCircle size={36} />
            </div>
            <h3 className="feature-title">Peer Review</h3>
            <p className="feature-desc">Automated workflow for teachers and reviewers to provide feedback, request revisions, and approve submissions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <Users size={36} />
            </div>
             <h3 className="feature-title">Community Driven</h3>
             <p className="feature-desc">Foster a community of student researchers, ensuring academic excellence and transparent publication processes.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
