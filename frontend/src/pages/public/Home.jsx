import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Users } from 'lucide-react';
import '../../styles/public.css';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Publish Your Research <span>with Confidence</span></h1>
        <p className="hero-subtitle">
          A streamlined platform for students to submit, review, and publish their academic journal papers. 
          Join a community of scholars today.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-hero btn-hero-primary">
            Apply Now
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
            <div className="feature-icon-wrapper">
              <FileText size={36} strokeWidth={1.5} />
            </div>
            <h3 className="feature-title">Intuitive Submission</h3>
            <p className="feature-desc">A frictionless interface for students to submit their research manuscripts, complete with secure cloud validation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <CheckCircle size={36} strokeWidth={1.5} />
            </div>
            <h3 className="feature-title">Rigorous Peer Review</h3>
            <p className="feature-desc">An advanced, double-blind workflow allowing distinguished reviewers to evaluate, request revisions, and approve submissions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={36} strokeWidth={1.5} />
            </div>
             <h3 className="feature-title">Community Driven</h3>
             <p className="feature-desc">Foster a vibrant community of elite researchers, ensuring academic distinction and completely transparent publication.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
