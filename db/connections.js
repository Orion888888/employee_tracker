const { Pool } = require('pg');

const pool = new Pool({
  // TODO: Enter PostgreSQL username
  user: 'postgres',
  // TODO: Enter PostgreSQL password
  password: 'Thumper1!',
  host: 'localhost',
  database: 'company_db'
});

pool.on('connect', () => {
  console.log('Connected to database.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
