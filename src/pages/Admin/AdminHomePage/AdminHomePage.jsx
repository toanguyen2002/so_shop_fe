import React, { useState } from "react";
import Sidebar from "../component/Sidebar/Sidebar";
import Dashboard from "../component/Dashboard/Dashboard";
import RegisterList from "../component/RegisterList/RegisterList";

const AdminHomePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-gray-800 fixed h-full">
        <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>

      {/* Scrollable right section */}
      <div className="ml-64 flex-1 overflow-y-scroll h-full">
        {activeTab === "dashboard" && <Dashboard />}

        {activeTab === "register-list" && <RegisterList />}
      </div>
    </div>
  );
};

export default AdminHomePage;
