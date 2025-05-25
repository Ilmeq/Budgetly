// src/context/ExpensesContext.js
import { createContext, useState, useEffect } from 'react';

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching expenses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  return (
    <ExpensesContext.Provider 
      value={{ 
        expenses, 
        setExpenses,
        addExpense,
        isLoading,
        error,
        refreshExpenses: fetchExpenses
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};