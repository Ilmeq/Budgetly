// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import AddExpensePage from "./pages/AddExpensePage";
import ExpensesPage from "./pages/ExpensesPage";
import Layout from "./components/Layout";
import AddIncomePage from "./pages/AddIncomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./PrivateRoute";
import Planner from "./pages/Planner";
import Dashboard from "./pages/Dashboard";
import PlannerProgress from "./components/PlannerProgress"; //  
import SpendingLimits from "./pages/SpendingLimits"; //  

const AppRoutes = () => {
  const location = useLocation();
  const noLayoutRoutes = ["/signin", "/signup"];
  const token = localStorage.getItem("token");

  const shouldUseLayout = !noLayoutRoutes.includes(location.pathname);

  return shouldUseLayout ? (
    <Layout>
      <Routes>
        {/* Redirect root based on login */}
        <Route
          path="/"
          element={<Navigate to={token ? "/expenses" : "/signin"} replace />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-expense"
          element={
            <PrivateRoute>
              <AddExpensePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <ExpensesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-income"
          element={
            <PrivateRoute>
              <AddIncomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <PrivateRoute>
              <Planner />
            </PrivateRoute>
          }
        />
        <Route
          path="/planner/progress"
          element={
            <PrivateRoute>
              <PlannerProgress />
            </PrivateRoute>
          }
        />
        <Route
          path="/limits"
          element={
            <PrivateRoute>
              <SpendingLimits />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Layout>
  ) : (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      {/* Force unknown routes to sign in */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;








