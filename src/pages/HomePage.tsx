import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import BubbleBackground from "../components/BubbleBackground";

export default function HomePage() {
  const navigate = useNavigate();
  const [procesoVotacion, setProcesoVotacion] = useState<any>(null);
  const [personaVoto, setPersonaVoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const baseUrl = "https://votingbackend-fe5a580c2b2c.herokuapp.com/api";

  const fetchProcesoVotacion = async () => {
    try {
      const response = await fetch(`${baseUrl}/proceso-votacion`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data && data.length > 0) {
        const procesoActivo = data.find(
          (proceso: any) => proceso.etapa === "Votacion"
        );
        setProcesoVotacion(procesoActivo);
      } else {
        setProcesoVotacion(null);
      }
    } catch (error) {
      console.error("Error al obtener el proceso de votación:", error);
      setProcesoVotacion(null);
      setError("Error al cargar el proceso de votación");
    }
  };

  const fetchPersonaVoto = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const id_persona = userData.id_persona;
      let id_proceso = userData.proceso_id;

      if (!id_persona) {
        console.warn("No se encontró id_persona en localStorage");
        setPersonaVoto({ voto: false });
        return;
      }

      // Si no hay proceso_id en userData, usar el del procesoVotacion
      if (!id_proceso && procesoVotacion) {
        id_proceso = procesoVotacion.id_proceso;

        // Actualizar userData con el proceso_id
        const updatedUserData = { ...userData, proceso_id: id_proceso };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }

      if (!id_proceso) {
        console.warn(
          "No se encontró proceso_id en userData ni en procesoVotacion"
        );
        setPersonaVoto({ voto: false });
        return;
      }

      const response = await fetch(
        `${baseUrl}/personas/verificar-voto/${id_persona}/${id_proceso}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Persona no encontrada, asumiendo que no ha votado");
          setPersonaVoto({ voto: false });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPersonaVoto(data);
    } catch (error) {
      console.error("Error al verificar voto:", error);
      setPersonaVoto({ voto: false });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProcesoVotacion();
      setLoading(false);
    };

    loadData();
  }, []);

  // Ejecutar fetchPersonaVoto cuando procesoVotacion esté disponible
  useEffect(() => {
    if (procesoVotacion) {
      fetchPersonaVoto();
    }
  }, [procesoVotacion]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <BubbleBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-4">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Cargando...
            </h1>
            <p className="text-gray-600">
              Verificando estado del proceso de votación
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <BubbleBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Error de conexión
            </h1>
            <p className="text-gray-600">
              {error}. Por favor, intenta nuevamente más tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (procesoVotacion) {
    if (procesoVotacion.etapa === "Prevotacion") {
      return (
        <div className="relative min-h-screen overflow-hidden">
          <BubbleBackground />
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-4">
              <div className="text-6xl mb-4">⏰</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Las votaciones no han empezado!
              </h1>
              <p className="text-gray-600">
                El proceso de votación está en preparación. Por favor, espera a
                que se inicie oficialmente.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (procesoVotacion.etapa === "Postvotacion") {
      return (
        <div className="relative min-h-screen overflow-hidden">
          <BubbleBackground />
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-4">
              <div className="text-6xl mb-4">🏁</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Las votaciones han terminado!
              </h1>
              <p className="text-gray-600">
                El proceso de votación ha finalizado. Puedes revisar los
                resultados en la sección de estadísticas.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (personaVoto && personaVoto.voto) {
      return (
        <div className="relative min-h-screen overflow-hidden">
          <BubbleBackground />
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-4">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Ya has votado!
              </h1>
              <p className="text-gray-600">
                Tu voto ha sido registrado exitosamente. Gracias por participar.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-red-300 opacity-70 rounded-full blur-3xl animate-pulseSlow" />
        <div className="absolute bottom-[-60px] right-[-40px] w-96 h-96 bg-blue-300 opacity-70 rounded-full blur-3xl animate-pulseSlow delay-500" />
        <div className="absolute top-[50%] left-[30%] w-80 h-80 bg-yellow-200 opacity-70 rounded-full blur-3xl animate-pulseSlow delay-1000" />
        <div className="absolute top-[10%] right-[10%] w-40 h-40 bg-blue-200 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-200" />
        <div className="absolute top-[80%] left-[20%] w-56 h-56 bg-red-200 opacity-60 rounded-full blur-3xl animate-pulseSlow delay-300" />
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

      <BubbleBackground />
      <Navbar />

      {procesoVotacion && procesoVotacion.etapa === "Votacion" ? (
        <div className="px-6 py-10 max-w-screen-xl mx-auto space-y-10">
          <div className="bg-white shadow-md rounded-lg p-10 text-center">
            <div className="w-full h-60 bg-gray-300 rounded-md flex items-center justify-center">
              <img
                src="/src/assets/propaganda_imagen.jpg"
                alt="Propaganda Partido Nacional"
                className="w-full h-60 object-cover rounded-md"
              />
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-center">
            Partidos participantes en estas votaciones
          </h3>

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
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md mx-4">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Votación no disponible
            </h1>
            <p className="text-gray-600">
              El proceso de votación no está activo en este momento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
