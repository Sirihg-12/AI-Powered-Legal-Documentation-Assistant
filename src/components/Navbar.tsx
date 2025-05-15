import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFileAlt, FaBook, FaRobot, FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-800 to-blue-600 p-4 shadow-lg z-50">
      {/* Main container for the navigation bar */}
      <div className="flex justify-between items-center container mx-auto">
        <h1 className="text-white text-3xl font-bold font-serif tracking-wide">LegalEase AI</h1>
        
        {/* Horizontal menu with more space between items */}
        <div className="flex space-x-12"> {/* Adjusted space between links */}
          <Link to="/" className="text-white hover:text-blue-300 flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FaHome className="text-xl" />
            <span>Home</span>
          </Link>
          <Link to="/services" className="text-white hover:text-green-300 flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FaFileAlt className="text-xl" />
            <span>Services</span>
          </Link>
          <Link to="/documents" className="text-white hover:text-yellow-300 flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FaBook className="text-xl" />
            <span>My Documents</span>
          </Link>
          <Link to="/blogs" className="text-white hover:text-red-300 flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FaBook className="text-xl" />
            <span>Blogs</span>
          </Link>
          <Link to="/chatbot" className="text-white hover:text-purple-300 flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FaRobot className="text-xl" />
            <span>Chatbot</span>
          </Link>
          <Link to="/profile" className="text-white hover:text-orange-300 flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FaUser className="text-xl" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
