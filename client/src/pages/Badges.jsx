import React, { useState, useContext, useEffect } from 'react';
import { ExpensesContext } from '../context/ExpensesContext';

const Badges = () => {
  // All hooks declared at the top
  const { expenses, isLoading, error: contextError, setExpenses } = useContext(ExpensesContext);
  const [error, setError] = useState('');

  // Initial badges data
  const initialBadges = [
    { id: 1, name: 'Debt Destroyer', totalAmount: 0, paidAmount: 0, completed: false },
    { id: 2, name: 'Emergency Hero', totalAmount: 0, paidAmount: 0, completed: false },
    { id: 3, name: 'Savings Champion', totalAmount: 0, paidAmount: 0, completed: false },
    { id: 4, name: 'Investment Starter', totalAmount: 0, paidAmount: 0, completed: false },
    { id: 5, name: 'Retirement Planner', totalAmount: 0, paidAmount: 0, completed: false },
    { id: 6, name: 'Goal Getter', completed: false }
  ];

  const [badges, setBadges] = useState(initialBadges);
  const [inputAmounts, setInputAmounts] = useState({});

  // Calculations
  const totalIncome = expenses
    .filter(e => e.type && String(e.type).trim().toLowerCase() === 'income')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const totalExpenses = expenses
    .filter(e => e.type && String(e.type).trim().toLowerCase() === 'expense')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const availableIncome = totalIncome - totalExpenses;

  // Effects
  useEffect(() => {
    const completedCount = badges.filter(b => b.id !== 6 && b.completed).length;
    setBadges(prev => prev.map(badge => 
      badge.id === 6 ? { ...badge, completed: completedCount >= 3 } : badge
    ));
  }, [badges]);

  // Helper functions
  const handleSetAmount = (id) => {
    const amount = parseFloat(inputAmounts[id] || 0);
    if (amount > 0) {
      setBadges(badges.map(badge => 
        badge.id === id ? { ...badge, totalAmount: amount } : badge
      ));
      setInputAmounts({ ...inputAmounts, [id]: '' });
    }
  };

  const handleAddPayment = async (id) => {
    const payment = parseFloat(inputAmounts[id] || 0);
    
    if (payment <= 0) {
      setError('Payment amount must be positive');
      return;
    }

    if (payment > availableIncome) {
      setError(`You only have $${availableIncome.toFixed(2)} available. Cannot pay $${payment.toFixed(2)}`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const newExpense = {
        title: `Payment to ${badges.find(b => b.id === id).name}`,
        amount: payment,
        type: 'expense',
        category: 'Debt Payment',
        date: new Date().toISOString()
      };

      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) throw new Error("Failed to save payment");

      const data = await response.json();
      setExpenses([...expenses, data]);
      
      setBadges(badges.map(badge => {
        if (badge.id === id) {
          const newPaid = badge.paidAmount + payment;
          return { 
            ...badge, 
            paidAmount: newPaid,
            completed: newPaid >= badge.totalAmount
          };
        }
        return badge;
      }));

      setInputAmounts({ ...inputAmounts, [id]: '' });
      setError('');
      window.dispatchEvent(new Event('expenseAdded'));
      
    } catch (err) {
      setError(err.message);
    }
  };

  const getProgress = (badge) => {
    if (!badge.totalAmount) return 0;
    return Math.min(100, (badge.paidAmount / badge.totalAmount) * 100);
  };

  // Loading state check
if (isLoading) return <div className="p-6">Loading financial data...</div>;
if (contextError) return <div className="p-6">Error: {contextError}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Financial Badges</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="font-semibold">Available Income: ${availableIncome.toFixed(2)}</p>
        <p className="text-sm text-gray-600">
          Total Income: ${totalIncome.toFixed(2)} | Total Expenses: ${totalExpenses.toFixed(2)}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`bg-white rounded-xl shadow-md p-6 relative ${
              badge.id === 6 ? 'border-2 border-purple-500' : ''
            }`}
          >
            {badge.completed && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-4">{badge.name}</h2>
            
            {badge.id !== 6 ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="number"
                      placeholder="Enter total amount"
                      value={inputAmounts[badge.id] || ''}
                      onChange={(e) => setInputAmounts({
                        ...inputAmounts,
                        [badge.id]: e.target.value
                      })}
                      className="flex-1 p-2 border rounded-l-md"
                    />
                    <button
                      onClick={() => handleSetAmount(badge.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                    >
                      Set
                    </button>
                  </div>
                  {badge.totalAmount > 0 && (
                    <p className="text-sm text-gray-600">
                      Total: ${badge.totalAmount.toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${getProgress(badge)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>${badge.paidAmount.toFixed(2)} paid</span>
                    <span>${Math.max(0, badge.totalAmount - badge.paidAmount).toFixed(2)} left</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="Add payment"
                    value={inputAmounts[badge.id] || ''}
                    onChange={(e) => {
                      setInputAmounts({
                        ...inputAmounts,
                        [badge.id]: e.target.value
                      });
                      setError('');
                    }}
                    className="flex-1 p-2 border rounded-l-md"
                  />
                  <button
                    onClick={() => handleAddPayment(badge.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 disabled:bg-gray-300"
                    disabled={badge.totalAmount === 0 || availableIncome <= 0}
                  >
                    Pay
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-2">
                  Complete any 3 other badges to unlock this achievement!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-purple-500 h-4 rounded-full"
                    style={{ width: `${(badges.filter(b => b.completed)).length / 3 * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2">
                  Progress: {badges.filter(b => b.completed).length}/3 completed
                </p>
              </div>
            )}
            
            {badge.completed && (
              <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md text-center">
                {badge.id === 6 ? (
                  "Amazing! You're a Goal Getter!"
                ) : (
                  `Congratulations! You've earned the ${badge.name} badge!`
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;