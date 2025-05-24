import React from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-6">BUDGETLY</h2>
        <nav className="space-y-4">
          <Link
            to="/add-expense"
            className={`block w-full text-left px-4 py-2 rounded-md ${
              isActive("/add-expense") ? "bg-teal-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Add Expense
          </Link>
          <Link
            to="/add-income"
            className={`block w-full text-left px-4 py-2 rounded-md ${
              isActive("/add-income") ? "bg-teal-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Add Income
          </Link>
          <Link
            to="/expenses"
            className={`block w-full text-left px-4 py-2 rounded-md ${
              isActive("/expenses") ? "bg-teal-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Expenses
          </Link>
          <Link
            to="/goals"
            className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
          >
            Goals
          </Link>
          <Link
            to="/badges"
            className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
          >
            Badges
          </Link>
          <div className="mt-10 border-t pt-4">
            <Link
              to="/settings"
              className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
            >
              Settings
            </Link>
            <Link
              to="/logout"
              className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
            >
              Logout
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#e7f7fe]">
        {/* Top Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-md px-4 py-2 rounded-md border outline-none"
          />
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
};

export default Layout;


