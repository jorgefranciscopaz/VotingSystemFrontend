import React, { useState, useEffect } from "react";

interface CandidatoCardProps {
  id_candidato: number;
  fotoUrl: string;
  nombre: string;
  partido: string;
  movimiento?: string;
  ubicacion: string;
  rol: string;
  tipo: "Presidente" | "Diputado" | "Alcalde";
  maxSelecciones?: number; // Para diputados (máximo 9)
}

const CandidatoCard: React.FC<CandidatoCardProps> = ({
  id_candidato,
  fotoUrl,
  nombre,
  partido,
  movimiento,
  ubicacion,
  rol,
  tipo,
}) => {
  const [seleccionado, setSeleccionado] = useState(false);

  // Función para verificar si está seleccionado
  const verificarSeleccion = () => {
    const votosGuardados = JSON.parse(
      localStorage.getItem("votosSeleccionados") || "{}"
    );

    if (
      tipo === "Presidente" &&
      votosGuardados.presidentes?.some(
        (p: any) => p.id_candidato === id_candidato
      )
    ) {
      setSeleccionado(true);
    } else if (
      tipo === "Diputado" &&
      votosGuardados.diputados?.some(
        (d: any) => d.id_candidato === id_candidato
      )
    ) {
      setSeleccionado(true);
    } else if (
      tipo === "Alcalde" &&
      votosGuardados.alcaldes?.some((a: any) => a.id_candidato === id_candidato)
    ) {
      setSeleccionado(true);
    } else {
      setSeleccionado(false);
    }
  };

  // Verificar si ya está seleccionado al cargar
  useEffect(() => {
    verificarSeleccion();
  }, [id_candidato, tipo]);

  // Escuchar cambios en localStorage y eventos personalizados
  useEffect(() => {
    const handleStorageChange = () => {
      verificarSeleccion();
    };

    const handleCustomEvent = () => {
      verificarSeleccion();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("votosUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("votosUpdated", handleCustomEvent);
    };
  }, [id_candidato, tipo]);

  const handleSeleccion = () => {
    const votosGuardados = JSON.parse(
      localStorage.getItem("votosSeleccionados") || "{}"
    );

    if (tipo === "Presidente") {
      // Puede seleccionar múltiples presidentes (la validación se hace en VoteSummary)
      if (!votosGuardados.presidentes) {
        votosGuardados.presidentes = [];
      }

      if (!seleccionado) {
        // Verificar límite de 1 presidente
        if (votosGuardados.presidentes.length >= 1) {
          // Disparar evento para mostrar alerta en la página principal
          window.dispatchEvent(
            new CustomEvent("limiteExcedido", {
              detail: {
                tipo: "Presidente",
                mensaje: "Solo puede seleccionar 1 candidato a Presidente",
              },
            })
          );
          return;
        }
        votosGuardados.presidentes.push({
          id_candidato,
          nombre,
          foto_url: fotoUrl,
          partido,
          movimiento: movimiento || "",
          tipo,
        });
      } else {
        votosGuardados.presidentes = votosGuardados.presidentes.filter(
          (p: any) => p.id_candidato !== id_candidato
        );
      }
    } else if (tipo === "Diputado") {
      // Puede seleccionar diputados (la validación se hace en VoteSummary)
      if (!votosGuardados.diputados) {
        votosGuardados.diputados = [];
      }

      if (!seleccionado) {
        // Verificar límite de 9 diputados
        if (votosGuardados.diputados.length >= 9) {
          // Disparar evento para mostrar alerta en la página principal
          window.dispatchEvent(
            new CustomEvent("limiteExcedido", {
              detail: {
                tipo: "Diputado",
                mensaje:
                  "Solo puede seleccionar máximo 9 candidatos a Diputado",
              },
            })
          );
          return;
        }
        votosGuardados.diputados.push({
          id_candidato,
          nombre,
          foto_url: fotoUrl,
          partido,
          movimiento: movimiento || "",
          tipo,
        });
      } else {
        votosGuardados.diputados = votosGuardados.diputados.filter(
          (d: any) => d.id_candidato !== id_candidato
        );
      }
    } else if (tipo === "Alcalde") {
      // Puede seleccionar múltiples alcaldes (la validación se hace en VoteSummary)
      if (!votosGuardados.alcaldes) {
        votosGuardados.alcaldes = [];
      }

      if (!seleccionado) {
        // Verificar límite de 1 alcalde
        if (votosGuardados.alcaldes.length >= 1) {
          // Disparar evento para mostrar alerta en la página principal
          window.dispatchEvent(
            new CustomEvent("limiteExcedido", {
              detail: {
                tipo: "Alcalde",
                mensaje: "Solo puede seleccionar 1 candidato a Alcalde",
              },
            })
          );
          return;
        }
        votosGuardados.alcaldes.push({
          id_candidato,
          nombre,
          foto_url: fotoUrl,
          partido,
          movimiento: movimiento || "",
          tipo,
        });
      } else {
        votosGuardados.alcaldes = votosGuardados.alcaldes.filter(
          (a: any) => a.id_candidato !== id_candidato
        );
      }
    }

    localStorage.setItem("votosSeleccionados", JSON.stringify(votosGuardados));

    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent("votosUpdated"));

    setSeleccionado(!seleccionado);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 ${
        seleccionado ? "border-red-500" : "border-gray-200"
      } w-64 flex flex-col justify-between transition duration-300 hover:shadow-xl`}
    >
      {/* Imagen del candidato */}
      <img
        src={fotoUrl}
        alt={`Foto de ${nombre}`}
        className="w-full h-44 object-cover rounded-t-xl"
      />

      {/* Información del candidato */}
      <div className="p-4 flex-1">
        <h2 className="text-lg font-bold text-gray-800 mb-1">{nombre}</h2>
        <p className="text-sm text-gray-600">{partido}</p>
        <p className="text-sm text-gray-600">{movimiento}</p>
        <p className="text-sm text-gray-600">{ubicacion}</p>
        <p className="text-sm text-gray-600 mb-2">{rol}</p>
      </div>

      {/* Boleta estilo checkbox */}
      <div
        onClick={handleSeleccion}
        className={`cursor-pointer h-12 text-center flex items-center justify-center border-t border-gray-300 bg-gray-100 hover:bg-red-100 rounded-b-xl ${
          seleccionado ? "bg-red-200" : ""
        }`}
      >
        <span className="text-2xl text-red-600 font-bold">
          {seleccionado ? "❌" : ""}
        </span>
      </div>
    </div>
  );
};

export default CandidatoCard;
