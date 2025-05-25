import React, { useState } from "react";
import PlannerProgress from "../components/PlannerProgress";

const SpendingLimits = () => {
  const [refreshProgress, setRefreshProgress] = useState(false);

  const handleRefresh = () => {
    // Toggle the state to trigger a refresh
    setRefreshProgress(prev => !prev);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Spending Limits Progress</h1>
      <button
        onClick={handleRefresh}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Progress
      </button>
      <PlannerProgress refresh={refreshProgress} />
    </div>
  );
};

export default SpendingLimits;

