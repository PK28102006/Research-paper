const { readDb, writeDb } = require('../utils/jsonDb');

class User {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role; // 'student', 'reviewer', 'admin'
    this.mentor = data.mentor || null; // Optional mentor name
    this.createdAt = data.createdAt || new Date().toISOString();
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

    if (!['student', 'reviewer', 'admin'].includes(data.role)) {
      errors.push('Role must be student, reviewer, or admin');
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
  static findAll() {
    const db = readDb();
    return db.users || [];
  }

  static findById(id) {
    const users = this.findAll();
    return users.find(u => u.id === id);
  }

  static findByEmail(email) {
    const users = this.findAll();
    return users.find(u => u.email === email);
  }

  static create(data) {
    const validation = this.validate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if email already exists
    if (this.findByEmail(data.email)) {
      throw new Error('Email already exists');
    }

    const user = new User(data);
    const db = readDb();
    db.users.push(user);
    writeDb(db);
    return user;
  }

  static update(id, data) {
    const db = readDb();
    const index = db.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('User not found');
    }

    // If email is being changed, check for duplicates
    if (data.email && data.email !== db.users[index].email) {
      if (this.findByEmail(data.email)) {
        throw new Error('Email already exists');
      }
    }

    db.users[index] = { ...db.users[index], ...data };
    writeDb(db);
    return db.users[index];
  }

  static delete(id) {
    const db = readDb();
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== id);
    
    if (db.users.length === initialLength) {
      throw new Error('User not found');
    }

    writeDb(db);
    return true;
  }

  // Remove password from user object
  static sanitize(user) {
    if (!user) return null;
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

module.exports = User;
