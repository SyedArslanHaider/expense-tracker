import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const MonthlySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Use the live backend URL
  const API_URL = 'https://expense-tracker-5ir6.onrender.com/api';

  useEffect(() => {
    fetchSummary();
  }, [selectedMonth]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/summary/${selectedMonth}`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading monthly summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Monthly Summary</h1>
          <p className="text-sm text-gray-600 mt-1">Complete breakdown of expenses and balances</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month} {new Date().getFullYear()}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards - 4 cards only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-white font-bold text-xl">$</span>
          </div>
          <p className="text-sm text-white/90 mb-2">Total Expenses</p>
          <p className="text-2xl font-bold">${summary?.totalExpenses?.toFixed(2)}</p>
          <p className="text-xs text-white/80 mt-1">All household expenses</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-xl">🏠</span>
          </div>
          <p className="text-sm text-white/90 mb-2">Rent per Person</p>
          <p className="text-2xl font-bold">${summary?.rentPerPerson}</p>
          <p className="text-xs text-white/80 mt-1">Monthly rent contribution</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-xl">👥</span>
          </div>
          <p className="text-sm text-white/90 mb-2">Total with Rent</p>
          <p className="text-2xl font-bold">${summary?.totalWithRent?.toFixed(2)}</p>
          <p className="text-xs text-white/80 mt-1">Expenses + Rent</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-xl">📊</span>
          </div>
          <p className="text-sm text-white/90 mb-2">Per Person Share</p>
          <p className="text-2xl font-bold">${summary?.perPersonShare?.toFixed(2)}</p>
          <p className="text-xs text-white/80 mt-1">Each person's responsibility</p>
        </div>
      </div>

      {/* Balance Summary Table with Remaining to Pay Column */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Balance Summary</h2>
          <p className="text-sm text-gray-600 mt-1">Who owes whom and remaining payments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expenses Spent
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rent Share
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Responsibility
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Already Paid
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-orange-50">
                  💰 Remaining to Pay
                </th>
              </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary?.userBalances?.map((balance) => (
                <tr key={balance.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        balance.remainingToPay > 0 ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {balance.userName.charAt(0)}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {balance.userName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${balance.expenses.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${balance.rent.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${balance.shouldPay.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${balance.expenses.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      balance.balance >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className="mr-1">{balance.balance >= 0 ? '📥' : '📤'}</span>
                      ${Math.abs(balance.balance).toFixed(2)}
                      <span className="hidden sm:inline ml-1">
                        {balance.balance >= 0 ? 'to receive' : 'to pay'}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap bg-orange-50">
                    {balance.remainingToPay > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-red-600 font-bold text-sm sm:text-base">
                          ${balance.remainingToPay.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {balance.remainingToPay >= 150 
                            ? `($${balance.rent.toFixed(2)} rent + $${(balance.remainingToPay - 150).toFixed(2)} expense share)`
                            : `Need to pay this amount`}
                        </span>
                      </div>
                    ) : balance.willReceive > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-green-600 font-semibold text-sm">
                          ${balance.willReceive.toFixed(2)} to receive
                        </span>
                        <span className="text-xs text-gray-500">
                          Overpaid on expenses
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">✅ Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Expenses Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Expenses</h2>
          <p className="text-sm text-gray-600 mt-1">Complete list of all transactions</p>
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
               </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary?.expenses?.map((expense) => (
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
                      <span className="ml-2 text-sm text-gray-900">
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
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">{summary?.userBalances?.length || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{summary?.expenses?.length || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Expense per Person</p>
            <p className="text-2xl font-bold text-gray-900">
              ${((summary?.totalExpenses || 0) / (summary?.userBalances?.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;