import { useState } from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const toggleOrdersDropdown = () => {
    setIsOrdersDropdownOpen(!isOrdersDropdownOpen);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-lg font-bold">SELLER CENTER</div>
      <nav>
        <ul>
          <li
            className={`p-4 hover:bg-gray-700 cursor-pointer ${
              activeTab === "dashboard" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={`p-4 hover:bg-gray-700 cursor-pointer ${
              activeTab === "register-list" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("register-list")}
          >
            Register List
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
