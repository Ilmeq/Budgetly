import React, { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // TODO: Add functionality to send data to backend
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">+ Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
          >
            <option value="">Select the category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            {/* Add more categories if needed */}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="$0.00"
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
          />
        </div>

        {/* Expense Title */}
        <div>
          <label className="block font-medium mb-1">Expense Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Dinner"
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
          />
        </div>

        {/* Message */}
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter Message"
            className="w-full px-3 py-2 rounded-md bg-[#e7f7fe] outline-none text-teal-600 font-medium"
            rows="2"
          ></textarea>
        </div>

        {/* Submit Button */}
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


