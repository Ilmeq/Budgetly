import React from "react";

const Notifications = ({ notifications }) => {
  return (
    <div className="relative">
      <div className="absolute right-0 mt-2 w-72 max-h-64 overflow-auto bg-white shadow-lg rounded border border-gray-300 z-10 p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No spending alerts yet.</p>
        ) : (
          <ul className="space-y-2">
            {[...notifications].reverse().map(({ id, message, level }) => {
              let bgColor = "bg-blue-100 text-blue-800";
              if (level === "danger" || level === "warning") {
                bgColor = "bg-red-100 text-red-800";
              }

              return (
                <li
                  key={id}
                  className={`${bgColor} p-3 rounded-md shadow-sm font-semibold`}
                >
                  {message}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;





