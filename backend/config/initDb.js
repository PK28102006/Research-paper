const db = require('./db');

const initSchema = async () => {
  try {
    console.log('🔄 Initializing database schema...');

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin', 'reviewer')),
        mentor VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS papers (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        abstract TEXT NOT NULL,
        keywords VARCHAR(255) NOT NULL,
        pdf_name VARCHAR(255) NOT NULL,
        pdf_data TEXT,
        author_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        author_name VARCHAR(255) NOT NULL,
        reviewer_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        reviewer_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
        project_type VARCHAR(50) DEFAULT 'Individual' CHECK (project_type IN ('Individual', 'Team')),
        team_size INTEGER DEFAULT 1,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        reviewed_by VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        paper_id VARCHAR(255) REFERENCES papers(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        paper_id VARCHAR(255) REFERENCES papers(id) ON DELETE CASCADE,
        reviewer_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        comments TEXT,
        status_decision VARCHAR(50) CHECK (status_decision IN ('approved', 'rejected')),
        rejection_reason TEXT,
        review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Self-heal logic if schema was created with NOT NULL mistakenly earlier
    try {
      await db.query('ALTER TABLE reviews ALTER COLUMN comments DROP NOT NULL;');
    } catch(e) { /* ignore */ }

    console.log('✅ Database schema initialized successfully.');
  } catch (error) {
    console.error('❌ Error initializing schema:', error);
  }
};

module.exports = initSchema;
