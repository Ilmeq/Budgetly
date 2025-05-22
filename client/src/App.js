import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AddExpensePage from "./pages/AddExpensePage";
import ExpensesPage from "./pages/ExpensesPage";
import Layout from "./components/Layout";
import AddIncomePage from "./pages/AddIncomePage";



function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/expenses" replace />} />
          <Route path="/add-expense" element={<AddExpensePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/add-income" element={<AddIncomePage />} />
         

          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


