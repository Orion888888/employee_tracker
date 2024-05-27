const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
    // If DATABASE_URL environment variable is set (e.g., for Heroku deployment)
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // Fallback to local database connection parameters
    pool = new Pool({
        user: 'postgres',
        password: 'Thumper1!',
        host: 'localhost',
        database: 'company_db',
        port: 3002 // Default PostgreSQL port, add this line if it's missing
    });
}

pool.on('connect', () => {
    console.log('Connected to database.');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
