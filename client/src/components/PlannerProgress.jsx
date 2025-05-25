import React, { useEffect, useState } from "react";

const PlannerProgress = ({ refresh, onNotificationsUpdate }) => {
  const [progressData, setProgressData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setProgressData(null);
      setNotifications([]);
      setLoading(false);
      if (onNotificationsUpdate) onNotificationsUpdate([]);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/planner/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProgressData(data.categories || null);
        setNotifications(data.notifications || []);
        if (onNotificationsUpdate) onNotificationsUpdate(data.notifications || []);
      } else {
        setProgressData(null);
        setNotifications([]);
        if (onNotificationsUpdate) onNotificationsUpdate([]);
      }
    } catch (error) {
      console.error("Error fetching progress", error);
      setProgressData(null);
      setNotifications([]);
      if (onNotificationsUpdate) onNotificationsUpdate([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();

    const onExpenseAdded = () => {
      fetchProgress();
    };

    window.addEventListener("expenseAdded", onExpenseAdded);

    return () => {
      window.removeEventListener("expenseAdded", onExpenseAdded);
    };
  }, [refresh]);

  if (loading)
    return <p className="text-center text-gray-500">Loading progress...</p>;

  if (!progressData)
    return <p className="text-center text-gray-500">No progress data available.</p>;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Only progress bars, no notification display here */}
      {Object.entries(progressData).map(([category, { limit, spent }]) => {
        const percent = limit ? Math.min((spent / limit) * 100, 100) : 0;
        const progressColor =
          percent < 70
            ? "bg-teal-500"
            : percent < 100
            ? "bg-yellow-400"
            : "bg-red-500";

        return (
          <div
            key={category}
            className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-md"
          >
            <div className="w-48 text-gray-700 font-semibold truncate">
              {category}
            </div>
            <div className="flex-grow bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`${progressColor} h-4 rounded-full transition-all duration-500`}
                style={{ width: `${percent}%` }}
                title={`${percent.toFixed(1)}% used`}
              ></div>
            </div>
            <div className="w-24 text-right text-sm font-mono text-gray-600">
              ${spent.toFixed(2)} / ${limit.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlannerProgress;












