import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VotoExitoso() {
  const navigate = useNavigate();

  const volverAlInicio = () => {
    navigate("/home");
  };

  return (
    <div className="bg-green-100 min-h-screen pt-24">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Ícono de éxito */}
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Voto Registrado Exitosamente!
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            Su voto ha sido registrado correctamente en el sistema. Gracias por
            participar en el proceso democrático.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-green-800 mb-2">
              Información Importante:
            </h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Su voto ha sido registrado de forma segura y anónima</li>
              <li>
                • Los resultados serán publicados al finalizar el proceso
                electoral
              </li>
              <li>
                • Puede verificar el estado del proceso en cualquier momento
              </li>
            </ul>
          </div>

          <button
            onClick={volverAlInicio}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
