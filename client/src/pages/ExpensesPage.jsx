import React, { useEffect, useState } from "react";
import { FaFilter, FaSyncAlt } from "react-icons/fa";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD
  const [typeFilter, setTypeFilter] = useState(""); // "expense" or "income"
  const [statusFilter, setStatusFilter] = useState(""); // Future use: outcome/income status
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/expenses");
        const data = await response.json();
        console.log("Fetched expenses:", data);
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    if (dateFilter) {
      filtered = filtered.filter((item) =>
        new Date(item.date).toISOString().startsWith(dateFilter)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    if (statusFilter) {
      if (statusFilter === "income") {
        filtered = filtered.filter((item) => item.type === "income");
      } else if (statusFilter === "outcome") {
        filtered = filtered.filter((item) => item.type === "expense");
      }
    }

    setFilteredExpenses(filtered);
  }, [expenses, dateFilter, typeFilter, statusFilter]);

  const handleReset = () => {
    setDateFilter("");
    setTypeFilter("");
    setStatusFilter("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      {/* Filter Bar */}
      <div className="flex items-center mb-4 space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-600" />
          <span className="font-semibold">Filter By</span>
        </div>

        <div>
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div>
          <select
            className="border px-2 py-1 rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <select
            className="border px-2 py-1 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="income">Income</option>
            <option value="outcome">Outcome</option>
          </select>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center text-red-600 hover:underline"
        >
          <FaSyncAlt className="mr-1" /> Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Type</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {filteredExpenses.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-6 text-left">{item.title}</td>
                <td className="py-3 px-6 text-left">${item.amount}</td>
                <td className="py-3 px-6 text-left">{item.category}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpensesPage;



