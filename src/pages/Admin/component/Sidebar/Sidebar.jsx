import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-lg font-bold">Trung Tâm Quản lý</div>
      <nav>
        <ul>
          <li
            className={`p-4 hover:bg-gray-700 cursor-pointer ${
              activeTab === "register-list" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("register-list")}
          >
            Quản lý đăng ký
          </li>
        </ul>
      </nav>
      {/* Back to Home Button */}
      <div
        className="absolute bottom-0 w-full p-4 text-center hover:bg-gray-700 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Trở về trang chủ
      </div>
    </div>
  );
};

export default Sidebar;
