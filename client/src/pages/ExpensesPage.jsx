import React, { useEffect, useState } from "react";
import { FaFilter, FaUndo, FaTrash } from "react-icons/fa";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filterType, setFilterType] = useState(""); // "income" or "expense"
  const [filterDate, setFilterDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched expenses:", data);

      if (response.ok) {
        setExpenses(data);
        setFilteredExpenses(data);
      } else {
        console.error("Failed to fetch:", data.error);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      fetchData();
    };

    window.addEventListener("expenseAdded", handleUpdate);

    return () => {
      window.removeEventListener("expenseAdded", handleUpdate);
    };
  }, []);

  const applyFilter = () => {
    let filtered = [...expenses];

    if (filterType) {
      filtered = filtered.filter(
        (item) => item.type?.toLowerCase() === filterType
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.date).toISOString().split("T")[0] === filterDate
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

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const token = localStorage.getItem("token");
      const endpoint = type === 'income' ? 'incomes' : 'expenses';

      const response = await fetch(`http://localhost:5000/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove deleted record from state
        const updatedExpenses = expenses.filter((expense) => expense._id !== id);
        setExpenses(updatedExpenses);

        // Also update filtered expenses (in case a filter is applied)
        const updatedFiltered = filteredExpenses.filter((expense) => expense._id !== id);
        setFilteredExpenses(updatedFiltered);

        // Adjust current page if needed
        if (updatedFiltered.length <= (currentPage - 1) * itemsPerPage) {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
      } else {
        const errorData = await response.json();
        alert("Failed to delete record: " + (errorData.error || response.statusText));
      }
    } catch (error) {
      alert("Error deleting record: " + error.message);
    }
  };

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
      <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-md mb-4 shadow-sm flex-wrap">
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
        <div>
          <button
            onClick={fetchData}
            className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
          >
            Refresh
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
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {currentItems.map((item) => (
              <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{item.title}</td>
                <td className="py-3 px-6 text-left">${item.amount}</td>
                <td className="py-3 px-6 text-left">{item.category}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.type?.toLowerCase() === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.type?.toLowerCase() === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleDelete(item._id, item.type)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    title="Delete Record"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
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








