import { useNavigate } from "react-router-dom";
import CandidatoCard from "../components/CandidatoCard";
import Navbar from "../components/Navbar";

const candidatos = Array.from({ length: 12 }, (_, i) => ({
  fotoUrl: "/src/assets/JOH-1.jpg",
  nombre: `Alcalde ${i + 1}`,
  partido:
    i % 3 === 0
      ? "Partido Nacional"
      : i % 3 === 1
      ? "Partido Liberal"
      : "Partido Libre",
  ubicacion: "Departamento / Municipio",
  rol: "Alcalde",
}));

export default function AlcaldePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-green-100 min-h-screen pb-20">
      <Navbar />
      <h2 className="text-3xl font-bold text-center py-8 text-red-600">
        Candidatos a Alcalde
      </h2>

      <div className="px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {candidatos.map((c, i) => (
          <CandidatoCard key={i} {...c} />
        ))}
      </div>

      {/* Barra inferior fija */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50 flex justify-between items-center px-6 py-3">
        <button
          className="w-10 h-10 bg-gray-400 rounded-full text-white text-lg flex items-center justify-center"
          onClick={() => navigate("/votar/presidente")}
        >
          ←
        </button>
        <span className="text-center text-gray-700 font-semibold text-lg tracking-wide">
          ALCALDE
        </span>
        <button
          className="w-10 h-10 bg-gray-400 rounded-full text-white text-lg flex items-center justify-center"
          onClick={() => navigate("/")}
        >
          →
        </button>
      </div>
    </div>
  );
}
