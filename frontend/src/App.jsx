import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Users from './pages/Users';
import MonthlySummary from './pages/MonthlySummary';
// Force the API URL globally
window.API_URL = 'https://expense-tracker-sir6.onrender.com/api';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', name: 'Dashboard', icon: '📊' },
    { path: '/expenses', name: 'Expenses', icon: '💰' },
    { path: '/summary', name: 'Monthly Summary', icon: '📈' },
    { path: '/users', name: 'Users', icon: '👥' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        {/* Modern Navigation Bar */}
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo Section */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base sm:text-xl">$</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ExpenseTracker
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Shared Apartment Manager</p>
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                        isActive
                          ? 'text-indigo-600 bg-indigo-50 shadow-sm'
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                    {({ isActive }) => isActive && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-full"></span>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Right Section - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🏠</span>
                  </div>
                  <span className="text-sm text-gray-600">7 Members</span>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slideDown">
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                      }`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    {({ isActive }) => isActive && (
                      <span className="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                    )}
                  </NavLink>
                ))}
                
                {/* Mobile Footer Info */}
                <div className="pt-4 mt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🏠</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">7 Members</p>
                      <p className="text-xs text-gray-500">Shared Apartment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/summary" element={<MonthlySummary />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <p className="text-center text-xs sm:text-sm text-gray-500">
              © 2026 ExpenseTracker - Shared Apartment Expense Management
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;