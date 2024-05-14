const { Pool } = require('pg');

const pool = new Pool(
    {
      // TODO: Enter PostgreSQL username
      user: 'postgres',
      // TODO: Enter PostgreSQL password
      password: 'Thumper1!',
      host: 'localhost',
      database: 'company_db'
    },
    console.log(`Connected to database.`)
  )
  
//   const connection = pool.connect();
  module.exports = pool