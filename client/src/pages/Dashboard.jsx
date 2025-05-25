import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Create a separate component for the chart to prevent hook errors
const ChartComponent = ({ data }) => {
  return (
    <Pie 
      data={data} 
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
        },
      }} 
    />
  );
};

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found");
        window.location.href = "/signin";
        return;
      }

      const response = await fetch("http://localhost:5000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        }
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        window.location.href = "/signin";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleUpdate = () => fetchData();
    window.addEventListener("expenseAdded", handleUpdate);
    return () => window.removeEventListener("expenseAdded", handleUpdate);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete expense");
      }

      const updatedExpenses = expenses.filter(expense => expense._id !== id);
      setExpenses(updatedExpenses);
      alert("Expense deleted successfully!");
      window.dispatchEvent(new Event('expenseAdded'));
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

// Calculate metrics
  const totalExpense = expenses
    .filter(e => e.type?.toLowerCase() === 'expense')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const totalIncome = expenses
    .filter(e => e.type?.toLowerCase() === 'income')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  // Calculate weekly income (last 7 days)
  const weeklyIncome = expenses
    .filter(e => e.type?.toLowerCase() === 'income' && 
      new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const netSavings = totalIncome - totalExpense;
  const financialHealth = totalIncome > 0 
    ? Math.min(100, Math.max(0, (netSavings / totalIncome) * 100)) 
    : 0;

  // Prepare chart data
  const getCategoryData = () => {
    const categoryMap = {};
    
    expenses
      .filter(e => e.type?.toLowerCase() === 'expense')
      .forEach(expense => {
        const category = expense.category || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + parseFloat(expense.amount || 0);
      });

    const categories = Object.keys(categoryMap);
    const amounts = categories.map(cat => categoryMap[cat]);

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            '#00b3ff',
            '#3b3f48',
            '#afafaf',
            '#76d9df',
            '#ff6384',
            '#36a2eb',
            '#ffce56',
            '#4bc0c0',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const categoryData = getCategoryData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Income */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-semibold">Total Income</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold">${totalIncome.toFixed(2)}</div>
          <div className="mt-2 text-sm text-green-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            All-time income
          </div>
        </div>

        {/* Card 2: Total Expense */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-semibold">Total Expense</h3>
            <div className="bg-red-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold">${totalExpense.toFixed(2)}</div>
          <div className="mt-2 text-sm text-red-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            All-time expenses
          </div>
        </div>

        {/* Card 3: Net Savings */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-semibold">Net Savings</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div className={`text-3xl font-bold ${
            netSavings >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            ${netSavings.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {netSavings >= 0 ? 'Positive savings' : 'Negative savings'}
          </div>
        </div>

        {/* Card 4: Financial Health */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-semibold">Financial Health</h3>
            <div className="bg-purple-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold">{financialHealth.toFixed(0)}%</div>
          <div className="mt-2 text-sm text-green-500">
            {financialHealth > 70 ? "Excellent!" : 
             financialHealth > 40 ? "Good! Save more to improve." : 
             "Needs improvement"}
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Expense Breakdown</h2>
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
            <span className="text-gray-500 mr-2">6 Month</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        {expenses.length > 0 && categoryData.labels.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 lg:h-80">
              <ChartComponent data={categoryData} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-500 font-medium mb-1">Daily</h3>
                  <p className="text-2xl font-bold">${(totalExpense / 30).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-500 font-medium mb-1">Weekly</h3>
                  <p className="text-2xl font-bold">${(totalExpense / 4).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-500 font-medium mb-1">Monthly</h3>
                  <p className="text-2xl font-bold">${totalExpense.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-gray-500 font-medium mb-1">Categories</h3>
                  <p className="text-2xl font-bold">{categoryData.labels.length}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {loading ? "Loading data..." : "No expense data available to display chart."}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 5).map((item) => (
                <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">{item.title}</td>
                  <td className={`py-3 font-medium ${
                    item.type?.toLowerCase() === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.type?.toLowerCase() === 'income' ? '+' : '-'}${item.amount}
                  </td>
                  <td className="py-3">{item.category || '-'}</td>
                  <td className="py-3">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.type?.toLowerCase() === 'income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.type?.toLowerCase() === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <FaTrash size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    {loading ? "Loading transactions..." : "No transactions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;