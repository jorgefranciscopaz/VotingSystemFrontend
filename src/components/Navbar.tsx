import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: "Presidente", path: "/votar/presidente" },
    { label: "Alcalde", path: "/votar/alcalde" },
    { label: "Diputado", path: "/votar/diputado" },
  ];

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <img src="/logoRNP.png" alt="Logo RNP" className="h-10" />
        <h1 className="text-xl font-bold text-blue-800">VotingSystem</h1>
      </div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`hover:text-blue-600 px-3 py-1 rounded-md transition ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-800 font-semibold shadow-inner"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
