const db = require('../config/db');

class User {
  constructor(data) {
    this.id = data.id || Date.now().toString(); // Could use uuid in real world
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role; // 'student', 'reviewer', 'admin', 'teacher'
    this.mentor = data.mentor || null; // Optional mentor name
    this.createdAt = data.created_at || new Date().toISOString();
  }

  // Validation
  static validate(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!['student', 'reviewer', 'teacher', 'admin'].includes(data.role)) {
      errors.push('Role must be student, teacher, reviewer, or admin');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Database operations
  static async findAll() {
    const result = await db.query('SELECT * FROM users');
    return result.rows.map(row => new User(row));
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  static async create(data) {
    const validation = this.validate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if email already exists
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const user = new User(data);
    
    await db.query(`
      INSERT INTO users (id, name, email, password, role, mentor, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [user.id, user.name, user.email, user.password, user.role, user.mentor, user.createdAt]);

    return user;
  }

  static async update(id, data) {
    // Generate text and params for query
    let updateFields = [];
    let queryParams = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'created_at') {
        updateFields.push(`${key} = $${paramIndex}`);
        queryParams.push(value);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    queryParams.push(id);
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return new User(result.rows[0]);
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    return true;
  }

  // Remove password from user object
  static sanitize(user) {
    if (!user) return null;
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
  }
}

module.exports = User;
