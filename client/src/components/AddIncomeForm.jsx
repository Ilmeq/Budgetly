import React, { useState } from "react";

const AddIncomeForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    amount: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // ✅ Retrieve JWT

    try {
      const response = await fetch("http://localhost:5000/api/incomes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Income saved:", data);
        alert("Income added successfully!");
        setFormData({
          date: "",
          category: "",
          amount: "",
          title: "",
          message: "",
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to save income:", errorText);
        alert("Failed to save income: " + errorText);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Error connecting to backend.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">+ Add Income</h2>
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
            <option value="Salary">Salary</option>
            <option value="Gift">Gift</option>
            <option value="Freelance">Freelance</option>
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
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Income Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Monthly salary"
            className="w-full px-3 py-1.5 rounded-md bg-[#e7f7fe] outline-none"
            required
          />
        </div>
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
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          + Add Income
        </button>
      </form>
    </div>
  );
};

export default AddIncomeForm;

