const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow all origins (fix for Netlify)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API test: http://localhost:${PORT}/api/test`);
  console.log(`📊 Summary: http://localhost:${PORT}/api/expenses/summary/3\n`);
});