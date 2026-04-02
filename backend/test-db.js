const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'expense_tracker',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

const testDatabase = async () => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Check if users table exists
    const usersTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (usersTable.rows[0].exists) {
      console.log('✅ Users table exists');
      const users = await client.query('SELECT COUNT(*) FROM users');
      console.log(`📊 Users count: ${users.rows[0].count}`);
    } else {
      console.log('❌ Users table does not exist');
      console.log('💡 Run: node setup-database.js to create tables');
    }
    
    // Check if expenses table exists
    const expensesTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'expenses'
      );
    `);
    
    if (expensesTable.rows[0].exists) {
      console.log('✅ Expenses table exists');
      const expenses = await client.query('SELECT COUNT(*) FROM expenses');
      console.log(`💰 Expenses count: ${expenses.rows[0].count}`);
    } else {
      console.log('❌ Expenses table does not exist');
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testDatabase();