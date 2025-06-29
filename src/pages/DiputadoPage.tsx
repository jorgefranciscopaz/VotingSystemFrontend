import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CandidatoCard from "../components/CandidatoCard";
import Navbar from "../components/Navbar";

interface Partido {
  id_partido: number;
  nombre: string;
}
interface Movimiento {
  id_movimiento: number;
  nombre: string;
}

interface Candidato {
  id_candidato: number;
  nombre: string;
  foto_url: string;
  partido: Partido;
  movimiento: Movimiento; // Opcional si no se usa
}

/*const candidatos = Array.from({ length: 12 }, (_, i) => ({
  fotoUrl: "/src/assets/JOH-1.jpg",
  nombre: `Diputado ${i + 1}`,
  partido:
    i % 3 === 0
      ? "Partido Nacional"
      : i % 3 === 1
      ? "Partido Liberal"
      : "Partido Libre",
  ubicacion: "Departamento / Municipio",
  rol: "Diputado",
})); */

export default function DiputadoPage() {
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [votosSeleccionados, setVotosSeleccionados] = useState(0);
  const [alerta, setAlerta] = useState<string>("");

  useEffect(() => {
    fetch(
      "https://votingbackend-fe5a580c2b2c.herokuapp.com/api/candidatos-diputado"
    )
      .then((res) => res.json())
      .then((data) => setCandidatos(data))
      .catch((err) => console.error("Error al cargar candidatos:", err));
  }, []);

  // Función para actualizar el contador de votos
  const actualizarContador = () => {
    const votosGuardados = JSON.parse(
      localStorage.getItem("votosSeleccionados") || "{}"
    );
    const cantidad = votosGuardados.diputados?.length || 0;
    setVotosSeleccionados(cantidad);
  };

  // Escuchar cambios en los votos
  useEffect(() => {
    actualizarContador();

    const handleVotosUpdated = () => {
      actualizarContador();
    };

    const handleLimiteExcedido = (event: CustomEvent) => {
      setAlerta(event.detail.mensaje);
      setTimeout(() => setAlerta(""), 3000);

      // Revertir la última selección
      const votosGuardados = JSON.parse(
        localStorage.getItem("votosSeleccionados") || "{}"
      );

      if (
        event.detail.tipo === "Diputado" &&
        votosGuardados.diputados &&
        votosGuardados.diputados.length > 9
      ) {
        // Remover el último diputado seleccionado
        votosGuardados.diputados.pop();
        localStorage.setItem(
          "votosSeleccionados",
          JSON.stringify(votosGuardados)
        );
        window.dispatchEvent(new CustomEvent("votosUpdated"));
      }
    };

    window.addEventListener("votosUpdated", handleVotosUpdated);
    window.addEventListener(
      "limiteExcedido",
      handleLimiteExcedido as EventListener
    );

    return () => {
      window.removeEventListener("votosUpdated", handleVotosUpdated);
      window.removeEventListener(
        "limiteExcedido",
        handleLimiteExcedido as EventListener
      );
    };
  }, []);

  return (
    <div className="bg-green-100 min-h-screen pb-20 pt-24">
      <Navbar />

      {/* Alerta de límite excedido */}
      {alerta && (
        <div className="bg-red-100 border border-red-400 text-red-700 py-3 rounded mx-10 mt-4">
          <p className="font-semibold">{alerta}</p>
        </div>
      )}

      {/* Indicador de votos */}
      <div className=" bg-white shadow-md rounded-lg mx-8 mt-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-yellow-600">
            Candidatos a Diputado
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">
              Candidatos seleccionados: {votosSeleccionados}/9
            </div>
            <div className="text-sm text-gray-600">
              {votosSeleccionados === 0
                ? "No ha seleccionado candidatos"
                : votosSeleccionados <= 9
                ? `${votosSeleccionados} candidato${
                    votosSeleccionados > 1 ? "s" : ""
                  } seleccionado${votosSeleccionados > 1 ? "s" : ""}`
                : "Excede el límite"}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
        {candidatos.map((c) => (
          <CandidatoCard
            key={c.id_candidato}
            id_candidato={c.id_candidato}
            fotoUrl={c.foto_url}
            nombre={c.nombre}
            partido={c.partido.nombre}
            movimiento={c.movimiento ? c.movimiento.nombre : "Sin Movimiento"}
            ubicacion={"Santa Barbara"}
            rol="Diputado"
            tipo="Diputado"
          />
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
          DIPUTADO
        </span>
        <button
          className="w-10 h-10 bg-gray-400 rounded-full text-white text-lg flex items-center justify-center"
          onClick={() => navigate("/votar/alcalde")}
        >
          →
        </button>
      </div>
    </div>
  );
}
