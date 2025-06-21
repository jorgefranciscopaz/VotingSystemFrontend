import React from "react";
import Navbar from "../components/Navbar";
import logo from "../assets/logoRNP.png";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar para administrador (sin links navegables) */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo RNP" className="h-16" />
          <h1 className="text-xl font-bold text-blue-800">VotingSystem - Admin</h1>
        </div>
        <ul className="flex space-x-6 text-gray-400 font-medium">
          <li className="cursor-not-allowed">Presidente</li>
          <li className="cursor-not-allowed">Alcalde</li>
          <li className="cursor-not-allowed">Diputado</li>
        </ul>
      </nav>

      {/* Contenedor principal */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Botón Iniciar Votaciones */}
        <div className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-6 rounded-lg shadow-md text-center cursor-pointer">
          <h2 className="text-xl">Iniciar Votaciones</h2>
        </div>

        {/* Botón Finalizar Votaciones */}
        <div className="bg-green-500 hover:bg-green-600 text-white font-semibold p-6 rounded-lg shadow-md text-center cursor-pointer">
          <h2 className="text-xl">Finalizar Votaciones</h2>
        </div>

        {/* Botón Estadísticas */}
        <div className="md:col-span-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-6 rounded-lg shadow-md text-center cursor-pointer">
          <h2 className="text-xl">Ver Estadísticas de Votaciones</h2>
        </div>
      </main>
    </div>
  );
}
