import React from "react";

const Dashboard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-purple-500 text-white text-center rounded-lg">
          <h3>Order Pending</h3>
          <p className="text-2xl">2</p>
        </div>
        <div className="p-4 bg-red-500 text-white text-center rounded-lg">
          <h3>Order Cancel</h3>
          <p className="text-2xl">0</p>
        </div>
        <div className="p-4 bg-blue-500 text-white text-center rounded-lg">
          <h3>Order Process</h3>
          <p className="text-2xl">5</p>
        </div>
        <div className="p-4 bg-green-500 text-white text-center rounded-lg">
          <h3>Today's Income</h3>
          <p className="text-2xl">$9568.00</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
