const db = require('../config/db');

class Paper {
  constructor(data) {
    this.id = data.id || data.paper_id || Date.now().toString();
    this.title = data.title;
    this.abstract = data.abstract;
    this.keywords = data.keywords;
    this.pdfName = data.pdf_name || data.pdfName;
    this.pdfData = data.pdf_data || data.pdfData || null;
    this.authorId = data.author_id || data.authorId;
    this.authorName = data.author_name || data.authorName;
    this.reviewerId = data.reviewer_id || data.reviewerId || null;
    this.reviewerName = data.reviewer_name || data.reviewerName || null;
    this.status = data.status || 'pending'; // 'pending', 'under_review', 'approved', 'rejected'
    this.submittedAt = data.submitted_at || data.submittedAt || new Date().toISOString();
    this.reviewedAt = data.reviewed_at || data.reviewedAt || null;
    this.reviewedBy = data.reviewed_by || data.reviewedBy || null;
    this.projectType = data.project_type || data.projectType || 'Individual';
    this.teamSize = data.team_size || data.teamSize || 1;
    this.teamMembers = data.teamMembers || [];
    this.comments = data.comments || [];
    this.rejectionReason = data.rejection_reason || data.rejectionReason || null;
  }

  // Database operations
  static async findAll() {
    const result = await db.query('SELECT * FROM papers ORDER BY submitted_at DESC');
    return Promise.all(result.rows.map(row => this._populate(new Paper(row))));
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM papers WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this._populate(new Paper(result.rows[0]));
  }

  static async findByAuthor(authorId) {
    const result = await db.query('SELECT * FROM papers WHERE author_id = $1 ORDER BY submitted_at DESC', [authorId]);
    return Promise.all(result.rows.map(row => this._populate(new Paper(row))));
  }

  static async findByReviewer(reviewerId) {
    const result = await db.query('SELECT * FROM papers WHERE reviewer_id = $1 ORDER BY submitted_at DESC', [reviewerId]);
    return Promise.all(result.rows.map(row => this._populate(new Paper(row))));
  }

  static async findByStatus(status) {
    const result = await db.query('SELECT * FROM papers WHERE status = $1 ORDER BY submitted_at DESC', [status]);
    return Promise.all(result.rows.map(row => this._populate(new Paper(row))));
  }

  static async create(data) {
    const paper = new Paper(data);
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const res = await client.query(`
        INSERT INTO papers (
          id, title, abstract, keywords, pdf_name, pdf_data,
          author_id, author_name, reviewer_id, reviewer_name,
          status, project_type, team_size, submitted_at, reviewed_at, reviewed_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `, [
        paper.id, paper.title, paper.abstract, paper.keywords, paper.pdfName, paper.pdfData,
        paper.authorId, paper.authorName, paper.reviewerId, paper.reviewerName,
        paper.status, paper.projectType, paper.teamSize, paper.submittedAt, paper.reviewedAt, paper.reviewedBy
      ]);
      
      if (paper.projectType === 'Team' && paper.teamMembers.length > 0) {
        for (const member of paper.teamMembers) {
          await client.query(
            'INSERT INTO team_members (paper_id, name, email) VALUES ($1, $2, $3)',
            [paper.id, member.name, member.email]
          );
        }
      }

      await client.query('COMMIT');
      return await this.findById(res.rows[0].id);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async update(id, data) {
    const params = [];
    const fields = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'id') {
        let dbField = key;
        if (key === 'pdfName') dbField = 'pdf_name';
        if (key === 'pdfData') dbField = 'pdf_data';
        if (key === 'authorId') dbField = 'author_id';
        if (key === 'authorName') dbField = 'author_name';
        if (key === 'reviewerId') dbField = 'reviewer_id';
        if (key === 'reviewerName') dbField = 'reviewer_name';
        if (key === 'projectType') dbField = 'project_type';
        if (key === 'teamSize') dbField = 'team_size';
        if (key === 'submittedAt') dbField = 'submitted_at';
        if (key === 'reviewedAt') dbField = 'reviewed_at';
        if (key === 'reviewedBy') dbField = 'reviewed_by';
        
        if (key !== 'teamMembers' && key !== 'comments' && key !== 'rejectionReason') {
          fields.push(`${dbField} = $${paramIndex}`);
          params.push(value);
          paramIndex++;
        }
      }
    }

    if (fields.length > 0) {
      params.push(id);
      await db.query(`
        UPDATE papers 
        SET ${fields.join(', ')} 
        WHERE id = $${paramIndex}
      `, params);
    }

    return await this.findById(id);
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM papers WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new Error('Paper not found');
    }
    return true;
  }

  static async updateStatus(id, status, reviewerId = null, comments = null, rejectionReason = null, reviewerName = null) {
    const updateData = {
      status,
      reviewedAt: new Date().toISOString()
    };

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const pIndex = reviewerId ? [status, updateData.reviewedAt, reviewerId, reviewerName, id] : [status, updateData.reviewedAt, id];
      const reviewerUpdate = reviewerId ? ', reviewer_id = $3, reviewed_by = $4' : '';
      const idIdx = reviewerId ? '$5' : '$3';

      await client.query(`
        UPDATE papers 
        SET status = $1, reviewed_at = $2${reviewerUpdate}
        WHERE id = ${idIdx}
      `, pIndex);

      if (comments || rejectionReason || status === 'approved' || status === 'rejected') {
        let decision = null;
        if (status === 'approved' || status === 'rejected') decision = status;
        
        await client.query(
          `INSERT INTO reviews (paper_id, reviewer_id, comments, status_decision, rejection_reason, review_date) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, reviewerId, comments ? JSON.stringify(comments) : null, decision, rejectionReason, updateData.reviewedAt]
        );
      }
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return await this.findById(id);
  }

  static async _populate(paper) {
    const [teamResult, reviewsResult] = await Promise.all([
      db.query('SELECT name, email FROM team_members WHERE paper_id = $1', [paper.id]),
      db.query('SELECT reviewer_id, comments, status_decision, rejection_reason, review_date FROM reviews WHERE paper_id = $1 ORDER BY review_date ASC', [paper.id])
    ]);
    
    paper.teamMembers = teamResult.rows;
    paper.comments = [];
    
    reviewsResult.rows.forEach(r => {
      // Reconstitute comments exactly as frontend expects
      if (r.comments) {
        try {
          const parsed = JSON.parse(r.comments);
          if (Array.isArray(parsed)) {
             paper.comments.push(...parsed);
          } else {
             paper.comments.push(parsed);
          }
        } catch (e) {
          paper.comments.push({ text: r.comments, createdAt: r.review_date });
        }
      }
      
      // Keep track of the latest rejection reason
      if (r.rejection_reason) {
        paper.rejectionReason = r.rejection_reason;
      }
    });

    return paper;
  }
}

module.exports = Paper;
