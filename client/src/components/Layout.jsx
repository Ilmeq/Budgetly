// Layout.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Notifications from "./Notifications";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const fetchAndUpdateNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/planner/progress", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error("Failed to fetch planner progress");
        return;
      }

      const { notifications: fetchedNotifications } = await res.json();

      const formatted = fetchedNotifications.map((msg, i) => ({
        id: `${Date.now()}_${i}`,
        message: msg,
        level: msg.includes("exceeded")
          ? "danger"
          : msg.includes("90%")
          ? "warning"
          : "info"
      }));

      setNotifications(formatted);
      setUnreadCount(formatted.length);
    } catch (error) {
      console.error("Error fetching planner progress:", error);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      fetchAndUpdateNotifications();
    };

    window.addEventListener("expenseAdded", handler);
    fetchAndUpdateNotifications();

    return () => {
      window.removeEventListener("expenseAdded", handler);
    };
  }, [fetchAndUpdateNotifications]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) setUnreadCount(0);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md p-4 flex flex-col relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">BUDGETLY</h2>

          {/* Notification Bell */}
          <button
            onClick={toggleNotifications}
            aria-label="Notifications"
            className="relative text-gray-700 hover:text-teal-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center text-xs w-5 h-5 bg-red-600 text-white rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <nav className="space-y-4 flex-1">
          {[
            { path: "/dashboard", label: "Dashboard" },
            { path: "/add-expense", label: "Add Expense" },
            { path: "/add-income", label: "Add Income" },
            { path: "/expenses", label: "Expenses" },
            { path: "/limits", label: "Spending Limits" },
            { path: "/goals", label: "Goals" },
            { path: "/badges", label: "Badges" },
            { path: "/planner", label: "Planner" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                isActive(path)
                  ? "bg-teal-500 text-white"
                  : "hover:bg-gray-200"
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

        {/* Notifications dropdown */}
        {showNotifications && (
          <div className="absolute top-16 left-96 z-50">
            <Notifications notifications={notifications} />
          </div>
        )}
      </aside>

      {/* Main Content with animation */}
      <main className="flex-1 p-8 bg-[#e7f7fe] relative overflow-hidden">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-md px-4 py-2 rounded-md border outline-none"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;












