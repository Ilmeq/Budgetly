import React, { useEffect, useState } from "react";
import axios from "axios";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ date: "", type: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch expenses from backend when page loads
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/expenses") // 🔁 Adjust port if your backend uses a different one
      .then((response) => {
        setExpenses(response.data); // Make sure your backend returns an array of expenses
      })
      .catch((error) => {
        console.error("Failed to fetch expenses:", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter.date ? expense.date === filter.date : true) &&
      (filter.type ? expense.type === filter.type : true) &&
      (filter.status ? expense.status === filter.status : true)
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Expenses</h2>

      {/* Filter Section */}
      {/* ... no change here ... */}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
       <table className="min-w-full table-fixed text-left">
  <thead className="bg-gray-100">
    <tr>
      <th className="w-24 px-4 py-2 font-medium text-sm text-gray-700 align-middle">Amount</th>
      <th className="w-40 px-4 py-2 font-medium text-sm text-gray-700 align-middle">Title</th>
      <th className="w-60 px-4 py-2 font-medium text-sm text-gray-700 align-middle">Message</th>
      <th className="w-32 px-4 py-2 font-medium text-sm text-gray-700 align-middle">Date</th>
      <th className="w-32 px-4 py-2 font-medium text-sm text-gray-700 align-middle">Type</th>
      <th className="w-32 px-4 py-2 font-medium text-sm text-gray-700 align-middle">Status</th>
    </tr>
  </thead>
  <tbody>
    {filteredExpenses.map((expense, index) => (
      <tr key={index} className="border-t hover:bg-gray-50">
        <td className="px-4 py-2 text-sm align-middle">{expense.amount}</td>
        <td className="px-4 py-2 text-sm align-middle">{expense.title}</td>
        <td className="px-4 py-2 text-sm truncate align-middle">{expense.message}</td>
        <td className="px-4 py-2 text-sm align-middle">
          {new Date(expense.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="px-4 py-2 text-sm align-middle">{expense.type}</td>
        <td className="px-4 py-2 text-sm align-middle">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              expense.status === "Income"
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {expense.status}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Pagination */}
      {/* ... no change here ... */}
    </div>
  );
};

export default ExpensesPage;
