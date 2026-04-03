import axios from 'axios';

const API_BASE_URL = window.API_URL || 'https://expense-tracker-sir6.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
// Force redeploy
