const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'expense_tracker',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create expenses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(50),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Expenses table created');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
    `);
    console.log('✅ Indexes created');

    // Check if we have users
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      // Insert sample users
      await pool.query(`
        INSERT INTO users (name, email) VALUES 
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com'),
        ('Bob Wilson', 'bob@example.com'),
        ('Alice Brown', 'alice@example.com'),
        ('Charlie Davis', 'charlie@example.com')
      `);
      console.log('✅ Sample users inserted');
    }

    // Check if we have expenses
    const expenseCount = await pool.query('SELECT COUNT(*) FROM expenses');
    if (parseInt(expenseCount.rows[0].count) === 0) {
      // Insert sample expenses
      await pool.query(`
        INSERT INTO expenses (user_id, description, amount, category, date) VALUES 
        (1, 'Groceries - Walmart', 85.50, 'Groceries', '2026-03-15'),
        (1, 'Cleaning supplies', 25.00, 'Household', '2026-03-20'),
        (2, 'Groceries - Costco', 92.30, 'Groceries', '2026-03-18'),
        (2, 'Electricity bill', 120.00, 'Utilities', '2026-03-25'),
        (3, 'Internet bill', 65.00, 'Utilities', '2026-03-22'),
        (3, 'Water bill', 45.00, 'Utilities', '2026-03-23'),
        (4, 'Groceries - Trader Joes', 110.25, 'Groceries', '2026-03-19'),
        (5, 'Gas bill', 75.00, 'Utilities', '2026-03-24')
      `);
      console.log('✅ Sample expenses inserted');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('📊 Users:', (await pool.query('SELECT COUNT(*) FROM users')).rows[0].count);
    console.log('💰 Expenses:', (await pool.query('SELECT COUNT(*) FROM expenses')).rows[0].count);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
};

setupDatabase();