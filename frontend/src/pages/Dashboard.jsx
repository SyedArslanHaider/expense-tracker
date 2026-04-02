import { useState, useEffect } from 'react';
import api from '../api/config';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchSummary();
  }, [selectedMonth]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/expenses/summary/${selectedMonth}`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load data. Please check if backend is running.');
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
      <div className="flex items-center justify-center h-64 sm:h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 sm:p-6 rounded-xl">
        <p className="font-semibold text-sm sm:text-base">Error</p>
        <p className="text-xs sm:text-sm mt-1">{error}</p>
        <button 
          onClick={fetchSummary}
          className="mt-3 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header with Month Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Track and manage shared apartment expenses</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month} {new Date().getFullYear()}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Total Expenses Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white text-lg sm:text-xl font-bold">$</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            ${summary?.totalExpenses?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* Rent per Person Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white text-lg sm:text-xl">🏠</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Rent per Person</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            ${summary?.rentPerPerson || '150'}
          </p>
        </div>

        {/* Total with Rent Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white text-lg sm:text-xl">👥</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total with Rent</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            ${summary?.totalWithRent?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* Per Person Share Card */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-white text-lg sm:text-xl">📊</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Per Person Share</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            ${summary?.perPersonShare?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Balance Summary Table */}
      {summary?.userBalances && summary.userBalances.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Balance Summary</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Who owes whom at the end of the month</p>
          </div>
          
          {/* Table Container with Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Person
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses Spent
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Per Person Share
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-orange-50">
                    💰 Remaining to Pay (Includes Rent)
                  </th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.userBalances.map((balance) => {
                  // Calculate remaining to pay = Per Person Share - Expenses Spent
                  const remainingToPay = balance.shouldPay - balance.expenses;
                  
                  return (
                    <tr key={balance.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium ${
                            remainingToPay > 0 ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            {balance.userName.charAt(0)}
                          </div>
                          <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">
                            {balance.userName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                        ${balance.expenses.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                        ${balance.rent.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                        ${balance.shouldPay.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${
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
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap bg-orange-50">
                        {remainingToPay > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-red-600 font-bold text-sm sm:text-base">
                              ${remainingToPay.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {balance.expenses > 0 
                                ? `${balance.rent.toFixed(2)} rent + $${(remainingToPay - balance.rent).toFixed(2)} expense share`
                                : `${balance.rent.toFixed(2)} rent + $${remainingToPay - balance.rent} expense share`}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-green-600 font-semibold text-sm">
                              ${Math.abs(remainingToPay).toFixed(2)} to receive
                            </span>
                            <span className="text-xs text-gray-500">
                              Overpaid on expenses
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {(!summary?.userBalances || summary.userBalances.length === 0) && (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📊</div>
          <p className="text-gray-500 text-sm sm:text-base">No expense data available for this month</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Add some expenses to see the summary</p>
        </div>
      )}

      {/* Recent Expenses Preview */}
      {summary?.expenses && summary.expenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Recent Expenses</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Latest transactions in the household</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Person
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.expenses.slice(0, 5).map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 text-xs font-medium">
                            {expense.user_name.charAt(0)}
                          </span>
                        </div>
                        <span className="ml-2 text-xs sm:text-sm text-gray-900">
                          {expense.user_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;