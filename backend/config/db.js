const { Pool: PgPool } = require('pg');
const { neon } = require('@neondatabase/serverless');
const config = require('./index');

const dbUrl = config.dbUrl || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/research_portal';

// Check if using a Neon cloud database
const isNeon = dbUrl.includes('neon.tech');

let queryFn;

if (isNeon) {
  // Use Neon's serverless HTTP driver (works over HTTPS port 443)
  // This bypasses port 5432 blocks on restrictive networks
  const sql = neon(dbUrl);

  queryFn = async (text, params) => {
    // Use sql.query() for parameterized queries (not tagged template)
    const result = await sql.query(text, params || []);
    return { rows: result, rowCount: result.length };
  };

  console.log('🔗 Using Neon serverless driver (HTTPS)');
} else {
  // Use standard pg Pool for local PostgreSQL
  const pool = new PgPool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10,
  });

  pool.on('connect', () => {
    console.log('🔗 Connected to the PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
  });

  queryFn = (text, params) => pool.query(text, params);
}

module.exports = {
  query: queryFn,
};
