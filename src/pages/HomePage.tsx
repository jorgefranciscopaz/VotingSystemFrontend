import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const navigate = useNavigate();

  const partidos = [
    {
      nombre: "Partido Nacional",
      color: "bg-blue-100",
      logo: "/src/assets/partido_nacional.png",
    },
    {
      nombre: "Partido Liberal",
      color: "bg-yellow-100",
      logo: "/src/assets/partido_liberal.png",
    },
    {
      nombre: "Partido Libre",
      color: "bg-red-100",
      logo: "/src/assets/partido_libre.png",
    },
  ];

  const irAVotar = () => {
    navigate("/votar/presidente");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo dinámico */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-red-300 opacity-70 rounded-full blur-3xl animate-pulseSlow" />
        <div className="absolute bottom-[-60px] right-[-40px] w-96 h-96 bg-blue-300 opacity-70 rounded-full blur-3xl animate-pulseSlow delay-500" />
        <div className="absolute top-[50%] left-[30%] w-80 h-80 bg-yellow-200 opacity-70 rounded-full blur-3xl animate-pulseSlow delay-1000" />
        <div className="absolute top-[10%] right-[10%] w-40 h-40 bg-blue-200 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-200" />
        <div className="absolute top-[80%] left-[20%] w-56 h-56 bg-red-200 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-300" />
        <div className="absolute bottom-[10%] right-[20%] w-64 h-64 bg-yellow-300 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-700" />
        <div className="absolute top-[30%] left-[5%] w-52 h-52 bg-blue-200 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-900" />
        <div className="absolute bottom-[30%] right-[15%] w-44 h-44 bg-red-300 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-600" />
        <div className="absolute top-[40%] right-[5%] w-48 h-48 bg-yellow-200 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-400" />
        <div className="absolute bottom-[15%] left-[40%] w-60 h-60 bg-blue-300 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-300" />
        <div className="absolute top-[25%] right-[35%] w-36 h-36 bg-red-200 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-800" />
        <div className="absolute bottom-[45%] left-[25%] w-32 h-32 bg-yellow-100 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-1000" />
      </div>

      <Navbar />

      <div className="px-6 py-10 max-w-screen-xl mx-auto space-y-10">
        {/* Sección de propaganda */}
        <div className="bg-white shadow-md rounded-lg p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Imágenes de Propaganda de los partidos postulados</h2>
          <div className="w-full h-60 bg-gray-300 rounded-md flex items-center justify-center">
            <p className="text-xl text-gray-700">[Propaganda aquí]</p>
          </div>
        </div>

        {/* Título de partidos */}
        <h3 className="text-2xl font-semibold text-center">Partidos participantes en estas votaciones</h3>

        {/* Logos o tarjetas por partido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {partidos.map((partido, i) => (
            <div
              key={i}
              className={`rounded-lg shadow-md p-6 flex flex-col items-center justify-center ${partido.color}`}
            >
              <img
                src={partido.logo}
                alt={partido.nombre}
                className="h-24 mb-4 object-contain"
              />
              <h4 className="text-lg font-bold text-center text-gray-800">
                {partido.nombre}
              </h4>
            </div>
          ))}
        </div>

        {/* Botón Ir a Votar */}
        <div className="flex justify-center mt-10 mb-4">
          <button
            onClick={irAVotar}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg text-lg transition-all duration-300 hover:scale-105 animate-pulseSlow"
          >
            Ir a Votar
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
