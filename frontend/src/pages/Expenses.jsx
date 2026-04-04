import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    description: '',
    amount: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Use the live backend URL
  const API_URL = 'https://expense-tracker-5ir6.onrender.com/api';

  const categories = [
    'Food',
    'Groceries',
    'Utilities',
    'Household',
    'Cleaning',
    'Other',
  ];

  useEffect(() => {
    fetchExpenses();
    fetchUsers();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, formData);
      setShowForm(false);
      setFormData({
        user_id: '',
        description: '',
        amount: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API_URL}/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
      }
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    if (selectedUser !== 'all' && expense.user_id !== parseInt(selectedUser)) return false;
    if (selectedCategory !== 'all' && expense.category !== selectedCategory) return false;
    return true;
  });

  // Calculate totals
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const uniqueUsers = [...new Set(expenses.map(exp => exp.user_name))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-600 mt-1">Track all household expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 w-full sm:w-auto flex items-center justify-center space-x-2"
        >
          <span className="text-lg">{showForm ? '✕' : '+'}</span>
          <span>{showForm ? 'Cancel' : 'Add Expense'}</span>
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Add New Expense</h2>
            <p className="text-indigo-100 text-sm">Enter the expense details below</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person
                </label>
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select person</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Groceries at Walmart"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Stats */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Expenses</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Persons</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
            <p className="text-xs opacity-90">Total Expenses</p>
            <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white">
            <p className="text-xs opacity-90">Total Items</p>
            <p className="text-xl font-bold">{filteredExpenses.length}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 text-white">
            <p className="text-xs opacity-90">People</p>
            <p className="text-xl font-bold">{uniqueUsers.length}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 text-white">
            <p className="text-xs opacity-90">Avg per Person</p>
            <p className="text-xl font-bold">
              ${(totalAmount / (uniqueUsers.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Expense List</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 sm:px-6 py-8 text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-gray-500">No expenses found</p>
                    <p className="text-gray-400 text-sm mt-1">Click "Add Expense" to get started</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 text-xs font-medium">
                            {expense.user_name.charAt(0)}
                          </span>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {expense.user_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        expense.category === 'Food' ? 'bg-red-100 text-red-700' :
                        expense.category === 'Groceries' ? 'bg-green-100 text-green-700' :
                        expense.category === 'Utilities' ? 'bg-blue-100 text-blue-700' :
                        expense.category === 'Household' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
                      >
                        <span>🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {filteredExpenses.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Highest Expense</p>
              <p className="text-lg font-bold text-gray-900">
                ${Math.max(...filteredExpenses.map(e => parseFloat(e.amount)), 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Lowest Expense</p>
              <p className="text-lg font-bold text-gray-900">
                ${filteredExpenses.length > 0 ? Math.min(...filteredExpenses.map(e => parseFloat(e.amount))).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Expense</p>
              <p className="text-lg font-bold text-gray-900">
                ${filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;