import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <img src="/src/assets/logoRNP.png" alt="Logo RNP" className="h-12" />
        <h1 className="text-xl font-bold text-blue-800">VotingSystem</h1>
      </div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
      </ul>
    </nav>
  );
};

export default Navbar;
