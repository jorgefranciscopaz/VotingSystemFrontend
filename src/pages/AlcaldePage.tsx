import React from "react";
import CandidatoCard from "../components/CandidatoCard";
import Navbar from "../components/NavBar";

const candidatos = Array.from({ length: 12 }, (_, i) => ({
  fotoUrl: "/src/assets/JOH-1.jpg",
  nombre: `Presidente ${i + 1}`,
  partido:
    i % 3 === 0
      ? "Partido Nacional"
      : i % 3 === 1
      ? "Partido Liberal"
      : "Partido Libre",
  ubicacion: "Departamento / Municipio",
  rol: "ALcalde",
}));

export default function PresidentePage() {
  return (
    <div className="bg-green-100 min-h-screen">
      <Navbar />
      <h2 className="text-3xl font-bold text-center py-8 text-red-600">
        Candidatos a Alcalde
      </h2>

      <div className="px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {candidatos.map((c, i) => (
          <CandidatoCard key={i} {...c} />
        ))}
      </div>
    </div>
  );
}
