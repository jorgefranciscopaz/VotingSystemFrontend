import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface CandidatoSeleccionado {
  id_candidato: number;
  nombre: string;
  foto_url: string;
  partido: string;
  movimiento: string;
  tipo: "Presidente" | "Diputado" | "Alcalde";
}

interface VotoResumen {
  presidentes: CandidatoSeleccionado[];
  diputados: CandidatoSeleccionado[];
  alcaldes: CandidatoSeleccionado[];
}

export default function VoteSummary() {
  const navigate = useNavigate();
  const [votos, setVotos] = useState<VotoResumen>({
    presidentes: [],
    diputados: [],
    alcaldes: [],
  });
  const [errores, setErrores] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votoNulo, setVotoNulo] = useState(false);

  useEffect(() => {
    // Obtener votos del localStorage
    const votosGuardados = JSON.parse(
      localStorage.getItem("votosSeleccionados") || "{}"
    );
    setVotos(votosGuardados);

    // Verificar si debe ser voto nulo
    const debeSerNulo = verificarVotoNulo(votosGuardados);
    setVotoNulo(debeSerNulo);
  }, []);

  const verificarVotoNulo = (votos: VotoResumen): boolean => {
    // Si no hay presidentes, es voto nulo
    if (!votos.presidentes || votos.presidentes.length === 0) return true;

    // Si hay más de 1 presidente, es voto nulo
    if (votos.presidentes.length > 1) return true;

    // Si no hay alcaldes, es voto nulo
    if (!votos.alcaldes || votos.alcaldes.length === 0) return true;

    // Si hay más de 1 alcalde, es voto nulo
    if (votos.alcaldes.length > 1) return true;

    // Si no hay diputados, es voto nulo
    if (!votos.diputados || votos.diputados.length === 0) return true;

    // Si hay más de 9 diputados, es voto nulo
    if (votos.diputados.length > 9) return true;

    return false;
  };

  const validarVotos = (): boolean => {
    const nuevosErrores: string[] = [];

    // Si es voto nulo, no mostrar errores de validación
    if (votoNulo) {
      setErrores([]);
      return true;
    }

    // Validar presidente
    if (!votos.presidentes || votos.presidentes.length === 0) {
      nuevosErrores.push(
        "Debe seleccionar exactamente 1 candidato a Presidente"
      );
    } else if (votos.presidentes.length > 1) {
      nuevosErrores.push(
        "Debe seleccionar exactamente 1 candidato a Presidente"
      );
    }

    // Validar diputados
    if (!votos.diputados || votos.diputados.length === 0) {
      nuevosErrores.push("Debe seleccionar al menos 1 candidato a Diputado");
    } else if (votos.diputados.length > 9) {
      nuevosErrores.push("No puede seleccionar más de 9 candidatos a Diputado");
    }

    // Validar alcalde
    if (!votos.alcaldes || votos.alcaldes.length === 0) {
      nuevosErrores.push("Debe seleccionar exactamente 1 candidato a Alcalde");
    } else if (votos.alcaldes.length > 1) {
      nuevosErrores.push("Debe seleccionar exactamente 1 candidato a Alcalde");
    }

    setErrores(nuevosErrores);
    return nuevosErrores.length === 0;
  };

  const enviarVotos = async () => {
    if (!validarVotos()) {
      return;
    }

    setIsSubmitting(true);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const personaId = userData.id_persona;
    const departamentoId = userData.departamento_id;
    const municipioId = userData.municipio_id;

    console.log("Datos del usuario:", userData);
    console.log("Votos a enviar:", votos);
    console.log("Es voto nulo:", votoNulo);

    // Verificar que todos los datos necesarios estén presentes
    if (!personaId) {
      setErrores(["Error: No se encontró el ID de la persona"]);
      setIsSubmitting(false);
      return;
    }

    if (!departamentoId) {
      setErrores(["Error: No se encontró el ID del departamento"]);
      setIsSubmitting(false);
      return;
    }

    if (!municipioId) {
      setErrores(["Error: No se encontró el ID del municipio"]);
      setIsSubmitting(false);
      return;
    }

    try {
      // Enviar voto presidencial
      const responsePresidencial = await fetch(
        "https://votingbackend-fe5a580c2b2c.herokuapp.com/api/votos-presidenciales",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_persona: personaId,
            id_candidato: votoNulo
              ? null
              : votos.presidentes?.[0]?.id_candidato || null,
            id_departamento: departamentoId,
            tiempo: new Date().toISOString(),
          }),
        }
      );

      if (!responsePresidencial.ok) {
        throw new Error(
          `Error en voto presidencial: ${responsePresidencial.status} ${responsePresidencial.statusText}`
        );
      }

      // Enviar votos diputados
      if (votoNulo) {
        // Si es voto nulo, enviar un solo voto con id_candidato null
        const responseDiputado = await fetch(
          "https://votingbackend-fe5a580c2b2c.herokuapp.com/api/votos-diputados",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_persona: personaId,
              id_candidato: null,
              id_departamento: departamentoId,
              tiempo: new Date().toISOString(),
            }),
          }
        );

        if (!responseDiputado.ok) {
          throw new Error(
            `Error en voto diputado: ${responseDiputado.status} ${responseDiputado.statusText}`
          );
        }
      } else {
        // Enviar votos normales para cada diputado seleccionado
        for (const diputado of votos.diputados) {
          const responseDiputado = await fetch(
            "https://votingbackend-fe5a580c2b2c.herokuapp.com/api/votos-diputados",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_persona: personaId,
                id_candidato: diputado.id_candidato,
                id_departamento: departamentoId,
                tiempo: new Date().toISOString(),
              }),
            }
          );

          if (!responseDiputado.ok) {
            throw new Error(
              `Error en voto diputado: ${responseDiputado.status} ${responseDiputado.statusText}`
            );
          }
        }
      }

      // Enviar voto alcalde
      const responseAlcalde = await fetch(
        "https://votingbackend-fe5a580c2b2c.herokuapp.com/api/votos-alcaldes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_persona: personaId,
            id_candidato: votoNulo
              ? null
              : votos.alcaldes?.[0]?.id_candidato || null,
            id_municipio: municipioId,
            tiempo: new Date().toISOString(),
          }),
        }
      );

      if (!responseAlcalde.ok) {
        throw new Error(
          `Error en voto alcalde: ${responseAlcalde.status} ${responseAlcalde.statusText}`
        );
      }

      // Limpiar localStorage y redirigir
      localStorage.removeItem("votosSeleccionados");
      navigate("/voto-exitoso");
    } catch (error) {
      console.error("Error al enviar votos:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setErrores([`Error al enviar los votos: ${errorMessage}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const volverAEditar = () => {
    navigate("/votar/presidente");
  };

  return (
    <div className="bg-green-100 min-h-screen pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Resumen de Votos
        </h2>

        {/* Aviso de voto nulo */}
        {votoNulo && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold mb-2">⚠️ Voto Nulo Detectado</h3>
            <p>
              Su voto será registrado como nulo debido a que:
              {(!votos.presidentes || votos.presidentes.length === 0) && (
                <span className="block">
                  • No seleccionó candidato a Presidente
                </span>
              )}
              {votos.presidentes && votos.presidentes.length > 1 && (
                <span className="block">
                  • Seleccionó más de 1 candidato a Presidente (
                  {votos.presidentes.length})
                </span>
              )}
              {(!votos.alcaldes || votos.alcaldes.length === 0) && (
                <span className="block">
                  • No seleccionó candidato a Alcalde
                </span>
              )}
              {votos.alcaldes && votos.alcaldes.length > 1 && (
                <span className="block">
                  • Seleccionó más de 1 candidato a Alcalde (
                  {votos.alcaldes.length})
                </span>
              )}
              {(!votos.diputados || votos.diputados.length === 0) && (
                <span className="block">
                  • No seleccionó candidatos a Diputado
                </span>
              )}
              {votos.diputados && votos.diputados.length > 9 && (
                <span className="block">
                  • Seleccionó más de 9 candidatos a Diputado (
                  {votos.diputados.length})
                </span>
              )}
            </p>
          </div>
        )}

        {/* Errores de validación */}
        {errores.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold mb-2">Errores de validación:</h3>
            <ul className="list-disc list-inside">
              {errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Presidente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">
            Presidente ({votos.presidentes?.length || 0}/1)
            {votos.presidentes && votos.presidentes.length > 1 && (
              <span className="text-red-500 text-sm ml-2">
                ⚠️ Excede el límite
              </span>
            )}
          </h3>
          {votos.presidentes && votos.presidentes.length > 0 ? (
            <div className="space-y-4">
              {votos.presidentes.map((presidente, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={presidente.foto_url}
                    alt={presidente.nombre}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{presidente.nombre}</p>
                    <p className="text-gray-600">{presidente.partido}</p>
                    {presidente.movimiento && (
                      <p className="text-gray-500 text-sm">
                        {presidente.movimiento}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500 italic">No seleccionado</p>
          )}
        </div>

        {/* Diputados */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-yellow-600">
            Diputados ({votos.diputados?.length || 0}/9)
            {votos.diputados && votos.diputados.length > 9 && (
              <span className="text-red-500 text-sm ml-2">
                ⚠️ Excede el límite
              </span>
            )}
          </h3>
          {votos.diputados && votos.diputados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {votos.diputados.map((diputado, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded"
                >
                  <img
                    src={diputado.foto_url}
                    alt={diputado.nombre}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{diputado.nombre}</p>
                    <p className="text-gray-600 text-sm">{diputado.partido}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500 italic">No seleccionados</p>
          )}
        </div>

        {/* Alcalde */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-red-600">
            Alcalde ({votos.alcaldes?.length || 0}/1)
            {votos.alcaldes && votos.alcaldes.length > 1 && (
              <span className="text-red-500 text-sm ml-2">
                ⚠️ Excede el límite
              </span>
            )}
          </h3>
          {votos.alcaldes && votos.alcaldes.length > 0 ? (
            <div className="space-y-4">
              {votos.alcaldes.map((alcalde, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={alcalde.foto_url}
                    alt={alcalde.nombre}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{alcalde.nombre}</p>
                    <p className="text-gray-600">{alcalde.partido}</p>
                    {alcalde.movimiento && (
                      <p className="text-gray-500 text-sm">
                        {alcalde.movimiento}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500 italic">No seleccionado</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center">
          <button
            onClick={volverAEditar}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver a Editar
          </button>

          <button
            onClick={enviarVotos}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : votoNulo
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isSubmitting
              ? "Enviando..."
              : votoNulo
              ? "Confirmar Voto Nulo"
              : "Confirmar Votos"}
          </button>
        </div>
      </div>
    </div>
  );
}
