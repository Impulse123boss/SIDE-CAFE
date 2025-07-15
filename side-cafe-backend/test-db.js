// test-db.js
import pool from './models/db.js';

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PostgreSQL is connected:', res.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

testConnection();
