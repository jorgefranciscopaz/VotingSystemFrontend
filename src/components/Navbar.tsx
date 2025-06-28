import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <img src="/src/assets/logoRNP.png" alt="Logo RNP" className="h-12" />
        <h1 className="text-xl font-bold text-blue-800">VotingSystem</h1>
      </div>
      <div className="flex items-center space-x-4">
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/home">Votar</Link>
          </li>
          <li>
            <Link to="/algoritmos">Algoritmos</Link>
          </li>
          <li>
            <Link to="/estadisticas">Estadisticas</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
