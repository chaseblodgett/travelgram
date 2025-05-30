import React, { useState } from "react";
import { Link } from "react-router-dom";

const TopNavigation = ({ handleLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md">
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
   
        <div className="text-2xl font-bold tracking-wide text-teal-600">
          <Link to="/" className="hover:text-teal-700 transition duration-200">
            Track My Travel
          </Link>
        </div>

        <div className="flex items-center space-x-8">
          
          <Link
            to="/About"
            className="text-lg hover:text-teal-700 transition duration-200"
          >
            About
          </Link>

          <button className="text-lg hover:text-teal-700 transition duration-200">
            Notifications
          </button>

          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 text-lg hover:text-teal-700 transition duration-200"
            >
              <span>Profile</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-10 border border-gray-200">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-teal-50"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-teal-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
