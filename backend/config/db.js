const { Pool } = require('pg');
const config = require('./index');

const pool = new Pool({
  connectionString: config.dbUrl || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/research_portal',
  // In production, you might want to enable SSL
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
  console.log('🔗 Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
