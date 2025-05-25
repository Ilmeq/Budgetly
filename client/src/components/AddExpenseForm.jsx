import React, { useState } from "react";

const CATEGORY_OPTIONS = [
  "Groceries",
  "Bills, rent, insurance",
  "Entertainment & Lifestyle",
  "Unexpected",
  "Medical"
];

const AddExpenseForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    title: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No authentication token found. Please sign in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Expense saved:", data);
        alert("Expense added successfully!");

        // Dispatch event
        window.dispatchEvent(
          new CustomEvent("expenseAdded", {
            detail: {
              category: formData.category,
              amount: parseFloat(formData.amount)
            }
          })
        );

        setFormData({
          date: "",
          category: "",
          amount: "",
          title: "",
          message: ""
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to save expense:", errorText);
        alert("Failed to save expense: " + errorText);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Error connecting to backend.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">+ Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
            required
          >
            <option value="">Select the category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="$0.00"
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Expense Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Dinner"
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
            required
          />
        </div>

        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter message (optional)"
            className="w-full px-3 py-2 rounded-md bg-[#e7f7fe] outline-none text-teal-600 font-medium"
            rows="2"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          + Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;










