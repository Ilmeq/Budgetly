import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

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
          {[
            { path: "/add-expense", label: "Add Expense" },
            { path: "/add-income", label: "Add Income" },
            { path: "/expenses", label: "Expenses" },
            { path: "/goals", label: "Goals" },
            { path: "/badges", label: "Badges" },
            { path: "/planner", label: "Planner" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                isActive(path) ? "bg-teal-500 text-white" : "hover:bg-gray-200"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="mt-10 border-t pt-4">
            <Link
              to="/settings"
              className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-md"
            >
              Settings
            </Link>
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





