const { Pool } = require('pg');
const config = require('./index');

const dbUrl = config.dbUrl || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/research_portal';

// Enable SSL for cloud databases (Neon, Supabase, etc.) or production
const needsSsl = dbUrl.includes('neon.tech') || dbUrl.includes('supabase') || dbUrl.includes('sslmode=require') || process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: dbUrl,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 30000,  // 30 seconds — Neon free tier can take time to wake up
  idleTimeoutMillis: 30000,
  max: 10,
});

// Test connection
pool.on('connect', () => {
  console.log('🔗 Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
