import React from "react";
import CandidatoCard from "../components/CandidatoCard";
import Navbar from "../components/NavBar";

// Datos simulados
const candidatosPorPartido = {
  "Partido Nacional": Array.from({ length: 12 }, (_, i) => ({
    fotoUrl: "/src/assets/JOH-1.jpg",
    nombre: `Candidato Nacional ${i + 1}`,
    partido: "Partido Nacional",
    ubicacion: "Francisco Morazán / Tegucigalpa",
    rol: "Diputado",
  })),
  "Partido Liberal": Array.from({ length: 12 }, (_, i) => ({
    fotoUrl: "/src/assets/JOH-1.jpg",
    nombre: `Candidato Liberal ${i + 1}`,
    partido: "Partido Liberal",
    ubicacion: "Atlántida / La Ceiba",
    rol: "Diputado",
  })),
  "Partido Libre": Array.from({ length: 12 }, (_, i) => ({
    fotoUrl: "/src/assets/JOH-1.jpg",
    nombre: `Candidato Libre ${i + 1}`,
    partido: "Partido Libre",
    ubicacion: "Cortés / San Pedro Sula",
    rol: "Diputado",
  })),
};

export default function HomePage() {
  return (
    <div className="bg-green-100 min-h-screen">
      <Navbar />

      <div className="px-10 py-10 space-y-16">
        <h1 className="text-4xl font-bold text-center mb-10">
          Bienvenido a la página de votaciones
        </h1>

        {Object.entries(candidatosPorPartido).map(([partido, lista], idx) => (
          <div key={partido} className="space-y-4">
            <h2
              className={`text-3xl font-semibold ${
                partido.includes("Nacional")
                  ? "text-blue-800"
                  : partido.includes("Liberal")
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {partido}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {lista.map((candidato, i) => (
                <CandidatoCard key={`${partido}-${i}`} {...candidato} />
              ))}
            </div>

            {idx < Object.keys(candidatosPorPartido).length - 1 && (
              <hr className="border-t-2 border-gray-400 my-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
