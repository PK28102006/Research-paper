const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function migrate() {
  const dataPath = path.join(__dirname, 'data', 'store.json');
  if (!fs.existsSync(dataPath)) {
    console.log('No store.json found. Skipping migration.');
    process.exit(0);
  }
  
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  let data;
  try {
    data = JSON.parse(rawData);
  } catch(e) {
    console.log('Invalid JSON');
    process.exit(1);
  }
  
  const users = data.users || [];
  const papers = data.papers || [];
  
  const client = await db.pool.connect();
  try {
    console.log('Starting migration to PostgreSQL...');
    
    // Migrate users (no transaction here to avoid full rollback)
    for (const user of users) {
      if (!user.id) user.id = Date.now().toString() + Math.random().toString().slice(2, 6);
      const mentor = user.mentor || null;
      let createdAt;
      try { createdAt = user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(); } catch(e) { createdAt = new Date().toISOString(); }
      
      const exists = await client.query('SELECT id FROM users WHERE email = $1', [user.email]);
      if (exists.rows.length === 0) {
        await client.query(`
          INSERT INTO users (id, name, email, password, role, mentor, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [user.id, user.name, user.email, user.password, user.role, mentor, createdAt]);
        console.log(`✅ User migrated: ${user.email}`);
      } else {
        console.log(`⚠️ User already exists: ${user.email}`);
      }
    }
    
    // Migrate papers
    for (const paper of papers) {
      const exists = await client.query('SELECT id FROM papers WHERE id = $1', [paper.id]);
      if (exists.rows.length === 0) {
        // Fix missing users
        let aId = paper.authorId || null;
        if (aId) {
          const authE = await client.query('SELECT id FROM users WHERE id = $1', [aId]);
          if (authE.rows.length === 0) aId = null;
        }
        let rId = paper.reviewerId || null;
        if (rId) {
          const revE = await client.query('SELECT id FROM users WHERE id = $1', [rId]);
          if (revE.rows.length === 0) rId = null;
        }
        let rBy = paper.reviewedBy || null;
        if (rBy && rId) {
            const rByE = await client.query('SELECT id FROM users WHERE id = $1', [rId]);
            rBy = rByE.rows.length > 0 ? rId : null;
        } else {
            rBy = null;
        }
        
        const pType = paper.projectType || 'Individual';
        const tSize = paper.teamSize || 1;
        
        try {
          await client.query(`
            INSERT INTO papers (
              id, title, abstract, keywords, pdf_name, pdf_data,
              author_id, author_name, reviewer_id, reviewer_name,
              status, project_type, team_size, submitted_at, reviewed_at, reviewed_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          `, [
            paper.id, paper.title, paper.abstract, paper.keywords, paper.pdfName, paper.pdfData || null,
            aId, paper.authorName, rId, paper.reviewerName || null,
            paper.status || 'pending', pType, tSize, paper.submittedAt || new Date().toISOString(), paper.reviewedAt || null, rBy
          ]);
          
          // Migrate comments into reviews
          if (paper.comments && paper.comments.length > 0) {
             for (const c of paper.comments) {
                await client.query(`
                   INSERT INTO reviews (paper_id, reviewer_id, comments, review_date)
                   VALUES ($1, $2, $3, $4)
                `, [paper.id, rId, JSON.stringify(c), c.createdAt || new Date().toISOString()]);
             }
          }
          
          console.log(`✅ Paper migrated: ${paper.title}`);
        } catch(ee) {
          console.error(`❌ Failed migrating paper ${paper.title}:`, ee.message);
        }
      } else {
        console.log(`⚠️ Paper already exists: ${paper.title}`);
      }
    }
    
    console.log('🎉 Migration to PostgreSQL completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
