// src/components/DashboardLayout.tsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Services", path: "/services" },
  { name: "My Documents", path: "/my-documents" },
  { name: "Chatbot", path: "/chatbot" },
  { name: "Blogs", path: "/blogs" },
  { name: "Profile", path: "/profile" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 bg-white p-2 rounded-full shadow-md focus:outline-none"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transition-transform transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:flex-shrink-0`}
      >
        <div className="h-full p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-6">AI Legal Assistant</h2>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-64 p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
