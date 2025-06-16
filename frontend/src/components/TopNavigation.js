import React, { useState } from "react";
import { Link } from "react-router-dom";

const TopNavigation = ({ handleLogout, profilePicture }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md font-sans">
        <div className="flex justify-between items-center py-4 mx-auto px-6 font-sans">
          
          {/* Left: Logo */}
          <Link
            to="/home"
            className="flex items-center px-4 space-x-1 text-2xl font-bold tracking-wide text-purple-400 hover:text-purple-300 transition duration-200"
          >
            <img src="/travel_logo.svg" alt="Travel Logo" className="h-10 w-10" />
            <span>Travelgram</span>
          </Link>
    
          {/* Right: Profile Picture */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 text-lg hover:text-purple-300 transition duration-200"
            >
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-700 shadow-md"
              />
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
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-10 border border-gray-700">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-600 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
    </nav>
  );
  
  
};

export default TopNavigation;
