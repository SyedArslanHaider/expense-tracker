const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Configuration for different environments
let poolConfig;

if (process.env.DATABASE_URL) {
  // Production on Render (using Neon)
  console.log('Using DATABASE_URL for connection');
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
  };
} else {
  // Local development (using individual credentials)
  console.log('🔍 Using local PostgreSQL credentials');
  console.log('DB_USER:', process.env.DB_USER || 'postgres');
  console.log('DB_NAME:', process.env.DB_NAME || 'expense_tracker');
  console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
  
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'expense_tracker',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    connectionTimeoutMillis: 5000,
  };
}

const pool = new Pool(poolConfig);

// Test connection and show current user
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const userResult = await client.query('SELECT current_user');
    console.log('\n Connected to PostgreSQL');
    console.log(`👤 Current database user: ${userResult.rows[0].current_user}`);
    
    // Test if we can read users table
    const testQuery = await client.query('SELECT COUNT(*) FROM users');
    console.log(`Users count: ${testQuery.rows[0].count}`);
    
    const testExpenses = await client.query('SELECT COUNT(*) FROM expenses');
    console.log(`Expenses count: ${testExpenses.rows[0].count}`);
    
    client.release();
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('\n💡 Troubleshooting:');
    if (process.env.DATABASE_URL) {
      console.error('Check your DATABASE_URL environment variable on Render');
    } else {
      console.error('1. Check your .env file: cat backend/.env');
      console.error('2. Or run in PostgreSQL:');
      console.error('   sudo -u postgres psql -d expense_tracker');
      console.error('   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;');
    }
    process.exit(1);
  }
};

testConnection();

module.exports = pool;