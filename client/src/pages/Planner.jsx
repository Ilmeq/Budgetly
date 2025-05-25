import React, { useState, useEffect } from "react";
import PlannerProgress from "../components/PlannerProgress";  // NEW import

const Planner = () => {
  const categoryList = [
    "Groceries",
    "Bills, rent, insurance",
    "Entertainment & Lifestyle",
    "Unexpected",
    "Medical",
  ];

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [initialAmount, setInitialAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [spendingLimits, setSpendingLimits] = useState(
    categoryList.reduce((acc, cat) => {
      acc[cat] = "";
      return acc;
    }, {})
  );

  // NEW state to trigger progress refresh
  const [refreshProgress, setRefreshProgress] = useState(false);

  useEffect(() => {
    const savedPlanner = JSON.parse(localStorage.getItem("plannerData"));
    if (savedPlanner) {
      setInitialAmount(savedPlanner.initialAmount || "");
      setStartDate(savedPlanner.startDate || "");
      setEndDate(savedPlanner.endDate || "");
      setSpendingLimits(savedPlanner.spendingLimits || {});
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare categories array to send to backend
    const categoriesArray = Object.entries(spendingLimits).map(([category, limit]) => ({
      category,
      limit: Number(limit) || 0,
    }));

    const plannerData = {
      initialAmount: Number(initialAmount),
      startDate,
      endDate,
      categories: categoriesArray,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(plannerData),
      });

      if (res.ok) {
        alert("Planner saved successfully!");
        // Save locally if you want
        localStorage.setItem("plannerData", JSON.stringify(plannerData));

        // Trigger progress refresh after save
        setRefreshProgress(prev => !prev);
      } else {
        const errorText = await res.text();
        alert("Failed to save planner: " + errorText);
      }
    } catch (err) {
      alert("Error connecting to backend.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Planner Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Initial Amount (your starting balance)</label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Plan Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate && e.target.value > endDate) {
                  setEndDate("");
                }
              }}
              className="w-full border rounded px-4 py-2"
              min={today}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Plan End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-4 py-2"
              min={startDate || today}
              required
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Set Spending Limits by Category</h2>
          {categoryList.map((category) => (
            <div key={category} className="flex items-center gap-4 mb-2">
              <label className="w-56">{category}</label>
              <input
                type="number"
                min="0"
                value={spendingLimits[category]}
                onChange={(e) =>
                  setSpendingLimits({
                    ...spendingLimits,
                    [category]: e.target.value,
                  })
                }
                className="border rounded px-3 py-1 w-48"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
        >
          Save Plan
        </button>
      </form>

      {/* Pass refreshProgress prop to PlannerProgress */}
      <div className="mt-12">
        <PlannerProgress refresh={refreshProgress} />
      </div>
    </div>
  );
};

export default Planner;






