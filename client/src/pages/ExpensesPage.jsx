import React, { useState } from "react";

const ExpensesPage = () => {
  const [filter, setFilter] = useState({
    date: "",
    type: "",
    status: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  const expenses = [
    { amount: "$22.40", title: "Project Done", message: "-", date: "04 Sep 2019", type: "Freelance", status: "Income" },
    { amount: "$40.50", title: "Dinner", message: "Had family dinner, amazing time", date: "28 May 2019", type: "Other", status: "Outcome" },
    { amount: "$200.00", title: "Car Repair", message: "Fixed lights", date: "23 Nov 2019", type: "Entertainment", status: "Outcome" },
    // Add more expenses here as needed
  ];

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
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="date" className="font-medium">Filter By:</label>
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-md"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Expense Type</option>
              <option value="Freelance">Freelance</option>
              <option value="Other">Other</option>
              <option value="Entertainment">Entertainment</option>
              {/* Add more types here */}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Expense Status</option>
              <option value="Income">Income</option>
              <option value="Outcome">Outcome</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Expenses"
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{expense.amount}</td>
                <td className="px-4 py-2">{expense.title}</td>
                <td className="px-4 py-2">{expense.message}</td>
                <td className="px-4 py-2">{expense.date}</td>
                <td className="px-4 py-2">{expense.type}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      expense.status === "Income"
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
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

      {/* Pagination (optional) */}
      <div className="mt-4 flex justify-between">
        <span>
  Showing 1–{filteredExpenses.length} of {filteredExpenses.length}
</span>

        <div className="space-x-2">
          <button className="px-4 py-2 bg-teal-500 text-white rounded-md">Previous</button>
          <button className="px-4 py-2 bg-teal-500 text-white rounded-md">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;

