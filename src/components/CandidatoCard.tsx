import React, { useState } from "react";

interface CandidatoCardProps {
  fotoUrl: string;
  nombre: string;
  partido: string;
  ubicacion: string;
  rol: string;
}

const CandidatoCard: React.FC<CandidatoCardProps> = ({
  fotoUrl,
  nombre,
  partido,
  ubicacion,
  rol,
}) => {
  const [seleccionado, setSeleccionado] = useState(false);

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
        <p className="text-sm text-gray-600">{ubicacion}</p>
        <p className="text-sm text-gray-600 mb-2">{rol}</p>
      </div>

      {/* Boleta estilo checkbox */}
      <div
        onClick={() => setSeleccionado(!seleccionado)}
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
