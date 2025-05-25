import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // Handle logout: clear token and redirect to sign in
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-6">BUDGETLY</h2>
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className={`block w-full text-left px-4 py-2 rounded-md ${
              isActive("/dashboard") ? "bg-teal-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Dashboard
          </Link>
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
            to="/badges"
            className={`block w-full text-left px-4 py-2 rounded-md ${
              isActive("/badges") ? "bg-teal-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Badges
          </Link>
          <Link
            to="/planner"
            className={`block w-full text-left px-4 py-2 rounded-md ${
              isActive("/planner") ? "bg-teal-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Planner
          </Link>
          <div className="mt-10 border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md text-red-500"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#e7f7fe]">
        {children}
      </main>
    </div>
  );
};

export default Layout;




