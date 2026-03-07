const { readDb, writeDb } = require('../utils/jsonDb');

class Paper {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.title = data.title;
    this.abstract = data.abstract;
    this.keywords = data.keywords;
    this.pdfName = data.pdfName;
    this.authorId = data.authorId;
    this.authorName = data.authorName;
    this.reviewerId = data.reviewerId || null;
    this.reviewerName = data.reviewerName || null;
    this.status = data.status || 'pending'; // 'pending', 'under_review', 'approved', 'rejected'
    this.submittedAt = data.submittedAt || new Date().toISOString();
    this.reviewedAt = data.reviewedAt || null;
    this.reviewedBy = data.reviewedBy || null;
    this.comments = data.comments || [];
    this.projectType = data.projectType || 'Individual';
    this.teamSize = data.teamSize || 1;
    this.teamMembers = data.teamMembers || [];
  }

  // Validation
  static validate(data) {
    const errors = [];

    if (!data.title || data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!data.abstract || data.abstract.trim().length < 50) {
      errors.push('Abstract must be at least 50 characters long');
    }

    if (!data.keywords || data.keywords.trim().length < 3) {
      errors.push('Keywords are required');
    }

    if (!data.authorId) {
      errors.push('Author ID is required');
    }

    if (!data.authorName) {
      errors.push('Author name is required');
    }

    if (data.projectType === 'Team') {
      const size = parseInt(data.teamSize, 10);
      if (isNaN(size) || size < 2 || size > 4) {
        errors.push('Team size must be between 2 and 4');
      } else if (!data.teamMembers || data.teamMembers.length !== size - 1) {
        errors.push(`Team project requires exactly ${size - 1} additional member(s)`);
      } else {
        data.teamMembers.forEach((member, index) => {
          if (!member.name || !member.email) {
            errors.push(`Name and email are required for team member ${index + 1}`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Database operations
  static findAll() {
    const db = readDb();
    return db.papers || [];
  }

  static findById(id) {
    const papers = this.findAll();
    return papers.find(p => p.id === id);
  }

  static findByAuthor(authorId) {
    const papers = this.findAll();
    return papers.filter(p => p.authorId === authorId);
  }

  static findByReviewer(reviewerId) {
    const papers = this.findAll();
    return papers.filter(p => p.reviewerId === reviewerId);
  }

  static findByStatus(status) {
    const papers = this.findAll();
    return papers.filter(p => p.status === status);
  }

  static create(data) {
    const validation = this.validate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const paper = new Paper(data);
    const db = readDb();
    db.papers.push(paper);
    writeDb(db);
    return paper;
  }

  static update(id, data) {
    const db = readDb();
    const index = db.papers.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Paper not found');
    }

    db.papers[index] = { ...db.papers[index], ...data };
    writeDb(db);
    return db.papers[index];
  }

  static delete(id) {
    const db = readDb();
    const initialLength = db.papers.length;
    db.papers = db.papers.filter(p => p.id !== id);
    
    if (db.papers.length === initialLength) {
      throw new Error('Paper not found');
    }

    writeDb(db);
    return true;
  }

  // Update paper status
  static updateStatus(id, status, reviewerId = null, comments = null) {
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const updateData = {
      status,
      reviewedAt: new Date().toISOString()
    };

    if (reviewerId) {
      updateData.reviewerId = reviewerId;
    }

    if (comments) {
      const paper = this.findById(id);
      updateData.comments = [...(paper.comments || []), comments];
    }

    return this.update(id, updateData);
  }
}

module.exports = Paper;
