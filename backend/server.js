const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/users');  // Changed from 'Users' to 'users'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS to allow all origins (for production)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://*.netlify.app', 'https://*.onrender.com'],
  credentials: true,
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

// Listen on all network interfaces (important for Render)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API test: http://localhost:${PORT}/api/test`);
  console.log(`📊 Summary: http://localhost:${PORT}/api/expenses/summary/3\n`);
});