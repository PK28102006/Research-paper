
import { Users, Mail, Globe } from 'lucide-react';

const About = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#111827' }}>About the Portal</h1>
      <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#4b5563', marginBottom: '3rem' }}>
        The Student Journal Paper Submission Portal is an academic project designed to simplify the process of publishing student research. 
        We believe that every student's research deserves a platform to be seen, reviewed, and appreciated. 
        Our goal is to bridge the gap between student researchers and academic reviewers through a seamless digital experience.
      </p>

      <div style={{ backgroundColor: '#f3f4f6', padding: '2rem', borderRadius: '8px', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Wait, what is this?</h2>
        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
            This is a full-stack capable frontend application built with <strong>React</strong> and <strong>Vite</strong>. 
            It demonstrates modern web development practices including role-based authentication, protected routing, 
            local state management, and responsive design—all without a backend dependency for demonstration purposes.
        </p>
      </div>

       <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Contact Us</h2>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '50%', color: '#2563eb' }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Email</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>support@journal.edu</div>
            </div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '50%', color: '#2563eb' }}>
              <Globe size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Website</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>www.journal.edu</div>
            </div>
         </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '50%', color: '#2563eb' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Team</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Student Dev Team</div>
            </div>
         </div>
       </div>
    </div>
  );
};

export default About;
