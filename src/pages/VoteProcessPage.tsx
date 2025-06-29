import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BubbleBackground from "../components/BubbleBackground";

const VoteProcessPage = () => {
  const [procesoActual, setProcesoActual] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = "https://votingbackend-fe5a580c2b2c.herokuapp.com/api";

  useEffect(() => {
    fetchProcesoActual();
  }, []);

  const fetchProcesoActual = async () => {
    try {
      const response = await fetch(`${baseUrl}/proceso-votacion`);
      const data = await response.json();

      if (data && data.length > 0) {
        const ultimoProceso = data[data.length - 1];
        setProcesoActual(ultimoProceso);
      }
    } catch (error) {
      console.error("Error al obtener el proceso de votación:", error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarProceso = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      const url = procesoActual
        ? `${baseUrl}/proceso-votacion/${procesoActual.id_proceso}`
        : `${baseUrl}/proceso-votacion`;

      const method = procesoActual ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          etapa: "Votacion",
          modificado_por: userData.id_usuario || 1,
        }),
      });

      if (response.ok) {
        alert("Proceso de votación iniciado correctamente");
        fetchProcesoActual();
      } else {
        alert("Error al iniciar el proceso de votación");
      }
    } catch (error) {
      alert("Error al iniciar el proceso de votación");
    }
  };

  const terminarProceso = async () => {
    if (!procesoActual) return;

    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      const response = await fetch(
        `${baseUrl}/proceso-votacion/${procesoActual.id_proceso}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            etapa: "Postvotacion",
            modificado_por: userData.id_usuario || 1,
          }),
        }
      );

      if (response.ok) {
        alert("Proceso de votación terminado correctamente");
        fetchProcesoActual();
      } else {
        alert("Error al terminar el proceso de votación");
      }
    } catch (error) {
      alert("Error al terminar el proceso de votación");
    }
  };

  const crearNuevoProceso = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      const response = await fetch(`${baseUrl}/proceso-votacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          etapa: "Prevotacion",
          modificado_por: userData.id_usuario || 1,
        }),
      });

      if (response.ok) {
        alert("Nuevo proceso de votación creado correctamente");
        fetchProcesoActual();
      } else {
        alert("Error al crear el nuevo proceso de votación");
      }
    } catch (error) {
      alert("Error al crear el nuevo proceso de votación");
    }
  };

  const getEstadoTexto = () => {
    if (!procesoActual) return "No hay proceso de votación registrado";

    switch (procesoActual.etapa) {
      case "Prevotacion":
        return "El proceso de votación está en PRE-VOTACIÓN";
      case "Votacion":
        return "El proceso de votación está EN CURSO";
      case "Postvotacion":
        return "El proceso de votación ha TERMINADO";
      default:
        return `Estado del proceso: ${procesoActual.etapa}`;
    }
  };

  const getColorEstado = () => {
    if (!procesoActual) return "text-gray-600";

    switch (procesoActual.etapa) {
      case "Prevotacion":
        return "text-yellow-600";
      case "Votacion":
        return "text-green-600";
      case "Postvotacion":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const puedeIniciar = () => {
    return (
      !procesoActual ||
      procesoActual.etapa === "Prevotacion" ||
      procesoActual.etapa === "Postvotacion"
    );
  };

  const puedeTerminar = () => {
    return procesoActual && procesoActual.etapa === "Votacion";
  };

  const puedeCrearNuevo = () => {
    return procesoActual && procesoActual.etapa === "Postvotacion";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando estado del proceso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <Navbar />
      <BubbleBackground />
      <div className="container mx-auto px-4 py-8 z-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🗳️ Proceso de Votación
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Estado Actual
              </h2>
              <p className={`text-lg font-medium ${getColorEstado()}`}>
                {getEstadoTexto()}
              </p>
            </div>

            {procesoActual && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Información del Proceso:
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Etapa:</span>
                    <p className="text-gray-600">{procesoActual.etapa}</p>
                  </div>
                  <div>
                    <span className="font-medium">Modificado por:</span>
                    <p className="text-gray-600">
                      {procesoActual.usuario.correo}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Creado:</span>
                    <p className="text-gray-600">
                      {procesoActual.created_at
                        ? new Date(procesoActual.created_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Última Modificación:</span>
                    <p className="text-gray-600">
                      {procesoActual.updated_at
                        ? new Date(procesoActual.updated_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              {puedeIniciar() && (
                <button
                  onClick={iniciarProceso}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  {!procesoActual
                    ? "🚀 Crear e Iniciar Proceso"
                    : procesoActual.etapa === "Postvotacion"
                    ? "🚀 Reiniciar Votación"
                    : "🚀 Iniciar Votación"}
                </button>
              )}

              {puedeTerminar() && (
                <button
                  onClick={terminarProceso}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  ⏹️ Terminar Votación
                </button>
              )}

              {puedeCrearNuevo() && (
                <button
                  onClick={crearNuevoProceso}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  🆕 Crear Nuevo Proceso
                </button>
              )}
            </div>

            {!puedeIniciar() && !puedeTerminar() && !puedeCrearNuevo() && (
              <div className="text-center text-gray-500 mt-4">
                <p>No hay acciones disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteProcessPage;
