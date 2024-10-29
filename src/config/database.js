const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost', // Default is 'localhost' if not specified
  port: 5432,        // Default PostgreSQL port
  database: 'postgres',
  max: 20,           // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to try to connect before timing out
  ssl: false,
});

// Test the database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Handle database errors
pool.on('error', (err) => {
  console.error('Database error:', err);
});

pool.on('connect', (client) => {
  client.query('SET search_path TO library');
});

module.exports = pool;