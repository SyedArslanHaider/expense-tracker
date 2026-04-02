-- Create database
CREATE DATABASE expense_tracker;

-- Connect to database
\c expense_tracker;

-- Create users table (without password)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);

-- Insert sample users
INSERT INTO users (name, email) VALUES 
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Wilson', 'bob@example.com'),
('Alice Brown', 'alice@example.com'),
('Charlie Davis', 'charlie@example.com'),
('Diana Miller', 'diana@example.com'),
('Eve Wilson', 'eve@example.com');

-- Insert sample expenses
INSERT INTO expenses (user_id, description, amount, category, date) VALUES 
(1, 'Groceries - Walmart', 85.50, 'Groceries', '2024-03-15'),
(1, 'Cleaning supplies', 25.00, 'Household', '2024-03-20'),
(2, 'Groceries - Costco', 92.30, 'Groceries', '2024-03-18'),
(2, 'Electricity bill', 120.00, 'Utilities', '2024-03-25'),
(3, 'Internet bill', 65.00, 'Utilities', '2024-03-22'),
(3, 'Water bill', 45.00, 'Utilities', '2024-03-23'),
(4, 'Groceries - Trader Joes', 110.25, 'Groceries', '2024-03-19'),
(4, 'Gas bill', 75.00, 'Utilities', '2024-03-24'),
(5, 'Cleaning service', 60.00, 'Household', '2024-03-21'),
(5, 'Groceries - Whole Foods', 135.40, 'Groceries', '2024-03-17'),
(6, 'Household items', 40.00, 'Household', '2024-03-26'),
(7, 'Groceries - Aldi', 70.25, 'Groceries', '2024-03-16');