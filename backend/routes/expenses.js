const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.name as user_name 
       FROM expenses e 
       JOIN users u ON e.user_id = u.id 
       ORDER BY e.date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  const { user_id, description, amount, category, date } = req.body;
  
  if (!user_id || !description || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, description, amount, category, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, description, amount, category, date || new Date()]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get monthly summary
router.get('/summary/:month', async (req, res) => {
  const { month } = req.params;
  
  try {
    // Get all users
    const users = await pool.query('SELECT id, name FROM users ORDER BY name');
    
    if (users.rows.length === 0) {
      return res.json({
        month,
        totalExpenses: 0,
        rentPerPerson: 150,
        totalWithRent: 0,
        perPersonShare: 0,
        perPersonExpenseShare: 0,
        userBalances: [],
        expenses: []
      });
    }
    
    // Get all expenses for the month
    const expenses = await pool.query(
      `SELECT e.*, u.name as user_name 
       FROM expenses e 
       JOIN users u ON e.user_id = u.id 
       WHERE EXTRACT(MONTH FROM e.date) = $1 
       ORDER BY e.user_id`,
      [month]
    );
    
    // Calculate totals
    const totalExpenses = expenses.rows.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const numberOfPeople = users.rows.length;
    const rentPerPerson = 150;
    const totalWithRent = totalExpenses + (rentPerPerson * numberOfPeople);
    const perPersonShare = totalWithRent / numberOfPeople;
    const perPersonExpenseShare = totalExpenses / numberOfPeople;
    
    // Calculate each person's balance
    const userBalances = users.rows.map(user => {
      const userExpenses = expenses.rows
        .filter(exp => exp.user_id === user.id)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      
      const totalPaid = userExpenses + rentPerPerson;
      const balance = totalPaid - perPersonShare;
      
      return {
        userId: user.id,
        userName: user.name,
        expenses: userExpenses,
        rent: rentPerPerson,
        totalPaid: totalPaid,
        shouldPay: perPersonShare,
        balance: balance,
        remainingToPay: balance < 0 ? Math.abs(balance) : 0,
        willReceive: balance > 0 ? balance : 0
      };
    });
    
    res.json({
      month,
      totalExpenses,
      rentPerPerson,
      totalWithRent,
      perPersonShare,
      perPersonExpenseShare,
      userBalances,
      expenses: expenses.rows
    });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;