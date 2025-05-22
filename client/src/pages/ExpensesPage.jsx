import React, { useEffect, useState } from "react";
import { FaFilter, FaUndo } from "react-icons/fa";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filterType, setFilterType] = useState(""); // "income" or "expense"
  const [filterDate, setFilterDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/expenses");
        const data = await response.json();
        console.log("Fetched expenses:", data);
        setExpenses(data);
        setFilteredExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchData();
  }, []);

  const applyFilter = () => {
    let filtered = [...expenses];

    if (filterType) {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    if (filterDate) {
      filtered = filtered.filter(
        (item) => new Date(item.date).toISOString().split("T")[0] === filterDate
      );
    }

    setFilteredExpenses(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterType("");
    setFilterDate("");
    setFilteredExpenses(expenses);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-md mb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <span className="text-gray-700 font-medium">Filter By</span>
        </div>
        <div>
          <label className="mr-2 text-sm">Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="mr-2 text-sm">Expense Type:</label>
          <input
            type="radio"
            name="type"
            value="expense"
            checked={filterType === "expense"}
            onChange={(e) => setFilterType(e.target.value)}
          />
        </div>
        <div>
          <label className="mr-2 text-sm">Income Type:</label>
          <input
            type="radio"
            name="type"
            value="income"
            checked={filterType === "income"}
            onChange={(e) => setFilterType(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={applyFilter}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
        <div className="flex items-center">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-400"
          >
            <FaUndo /> Reset
          </button>
        </div>
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
            {currentItems.map((item) => (
              <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{item.title}</td>
                <td className="py-3 px-6 text-left">${item.amount}</td>
                <td className="py-3 px-6 text-left">{item.category}</td>
                <td className="py-3 px-6 text-left">{new Date(item.date).toLocaleDateString()}</td>
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default ExpensesPage;





