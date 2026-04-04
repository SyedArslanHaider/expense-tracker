# 🏠 Shared Apartment Expense Tracker

A full-stack web application to manage shared apartment expenses, split bills, and calculate balances automatically.

---

## 🌐 Live Demo

- **Frontend:** [https://vocal-treacle-f65b91.netlify.app/](https://rxpensemang.netlify.app/)
- **Backend API:** [https://expense-tracker-5ir6.onrender.com/api/test](https://expense-tracker-5ir6.onrender.com/api/test)

---

## 📖 About The Project

Managing shared expenses with roommates can be messy and confusing. This app simplifies everything by providing a clean interface to track expenses, split bills, and calculate balances in real-time.

---

## 🎯 Problem

- Multiple people buying shared items
- No centralized tracking
- Manual calculations are error-prone
- Lack of transparency

---

## 💡 Solution

- Track all expenses in one place
- Automatically split rent and expenses
- Real-time balance calculation
- Monthly summaries

---

## ✨ Features

- ✅ User Management
- ✅ Expense Tracking
- ✅ Automatic Calculations
- ✅ Monthly Summary
- ✅ Responsive Design

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Neon)
- **Hosting:** Netlify (Frontend), Render (Backend)

---

## 🏗️ Architecture

Frontend (Netlify) → Backend API (Render) → Database (Neon)

---

## ⚙️ Installation

### 1. Clone Repo

```bash
git clone https://github.com/SyedArslanHaider/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
node server.js
```

Create `.env`:

```env
PORT=5000
DATABASE_URL=your_database_url
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Users

- GET `/api/users`
- POST `/api/users`
- DELETE `/api/users/:id`

### Expenses

- GET `/api/expenses`
- POST `/api/expenses`
- DELETE `/api/expenses/:id`
- GET `/api/expenses/summary/:month`

---

## 🗄️ Database Schema

### Users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
```

### Expenses

```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  description TEXT,
  amount DECIMAL,
  category VARCHAR(50),
  date DATE
);
```

---

## 🚀 Deployment

### Frontend (Netlify)

- Build: `npm run build`
- Publish: `dist`

### Backend (Render)

- Start: `node server.js`

### Database (Neon)

- PostgreSQL cloud database

---

## 🔮 Future Improvements

- Charts & Analytics
- Authentication
- Notifications
- Export to CSV

---

## 📞 Contact

**Syed Arslan Haider**
GitHub: [https://github.com/SyedArslanHaider](https://github.com/SyedArslanHaider)

---

⭐ If you like this project, give it a star!
