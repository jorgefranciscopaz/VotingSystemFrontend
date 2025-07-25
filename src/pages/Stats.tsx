import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type {
  EstadisticasGenerales,
  EstadisticasPresidenciales,
  EstadisticasDiputados,
  EstadisticasAlcaldes,
} from "../types/DatabaseTypes";

interface ProcesoVotacion {
  id_proceso: number;
  etapa: string;
  created_at: string;
  updated_at: string;
}

const Stats = () => {
  const [statsGenerales, setStatsGenerales] =
    useState<EstadisticasGenerales | null>(null);
  const [statsPresidenciales, setStatsPresidenciales] =
    useState<EstadisticasPresidenciales | null>(null);
  const [statsDiputados, setStatsDiputados] =
    useState<EstadisticasDiputados | null>(null);
  const [statsAlcaldes, setStatsAlcaldes] =
    useState<EstadisticasAlcaldes | null>(null);
  const [procesos, setProcesos] = useState<ProcesoVotacion[]>([]);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<number>(1);
  const [filtroDiputados, setFiltroDiputados] = useState("todos");
  const [filtroAlcaldes, setFiltroAlcaldes] = useState("todos");
  const [loading, setLoading] = useState(true);

  const url = "https://votingbackend-fe5a580c2b2c.herokuapp.com/api";
  //const url = "http://localhost:8000/api";

  const COLORS = [
    "#1976D2", // Nacional (azul fuerte)
    "#FF3B3F", // Liberal (rojo brillante)
    "#B22222", // Libre (rojo oscuro/burdeos)
  ];

  // Función para detectar empates en alcaldes
  const detectarEmpates = (data: any[]) => {
    if (data.length < 2) return new Set();

    const empates = new Set<string>();

    // Para cada municipio, verificar si hay empate entre los candidatos
    const municipiosUnicos = [...new Set(data.map((item) => item.name))];

    municipiosUnicos.forEach((municipio) => {
      // Obtener todos los candidatos de este municipio
      const candidatosMunicipio =
        statsAlcaldes?.candidatos?.filter(
          (c: any) => c.municipio === municipio
        ) || [];

      // Ordenar por votos descendente
      const candidatosOrdenados = candidatosMunicipio.sort(
        (a: any, b: any) => b.total_votos - a.total_votos
      );

      // Verificar si los dos primeros tienen la misma cantidad de votos
      if (
        candidatosOrdenados.length >= 2 &&
        candidatosOrdenados[0].total_votos ===
          candidatosOrdenados[1].total_votos
      ) {
        empates.add(municipio);
      }
    });

    return empates;
  };

  // Función para obtener todos los procesos de votación
  const fetchProcesos = async () => {
    try {
      const response = await fetch(`${url}/estadisticas/procesos`);
      const data = await response.json();
      setProcesos(data.procesos);

      // Si no hay proceso seleccionado, usar el más reciente
      if (data.procesos.length > 0 && !procesoSeleccionado) {
        setProcesoSeleccionado(data.procesos[0].id_proceso);
      }
    } catch (error) {
      console.error("Error fetching procesos:", error);
    }
  };

  // Función para obtener estadísticas con proceso específico
  const fetchData = async (procesoId: number) => {
    try {
      setLoading(true);

      const responseGenerales = await fetch(
        `${url}/estadisticas/generales?proceso_id=${procesoId}`
      );
      const dataGenerales = await responseGenerales.json();
      setStatsGenerales(dataGenerales);

      const responsePresidenciales = await fetch(
        `${url}/estadisticas/presidenciales?proceso_id=${procesoId}`
      );
      const dataPresidenciales = await responsePresidenciales.json();
      setStatsPresidenciales(dataPresidenciales);

      const responseDiputados = await fetch(
        `${url}/estadisticas/diputados?proceso_id=${procesoId}`
      );
      const dataDiputados = await responseDiputados.json();
      setStatsDiputados(dataDiputados);

      const responseAlcaldes = await fetch(
        `${url}/estadisticas/alcaldes?proceso_id=${procesoId}`
      );
      const dataAlcaldes = await responseAlcaldes.json();
      setStatsAlcaldes(dataAlcaldes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesos();
  }, []);

  useEffect(() => {
    if (procesoSeleccionado) {
      fetchData(procesoSeleccionado);
    }
  }, [procesoSeleccionado]);

  // Preparar datos para gráficos
  const dataPresidentes =
    statsPresidenciales?.candidatos?.map((candidato: any) => ({
      name: candidato.nombre,
      value: candidato.total_votos,
      partido: candidato.partido,
      movimiento: candidato.movimiento,
      porcentaje: candidato.porcentaje,
    })) || [];

  // Obtener partidos únicos para diputados
  const partidosDiputados = [
    ...new Set(statsDiputados?.candidatos?.map((c: any) => c.partido) || []),
  ] as string[];

  // Filtrar diputados por partido
  const dataDiputados =
    filtroDiputados === "todos"
      ? statsDiputados?.candidatos?.slice(0, 15).map((candidato: any) => ({
          name: candidato.nombre,
          votos: candidato.total_votos,
          partido: candidato.partido,
          movimiento: candidato.movimiento,
        })) || []
      : statsDiputados?.candidatos
          ?.filter((c: any) => c.partido === filtroDiputados)
          .slice(0, 8)
          .map((candidato: any) => ({
            name: candidato.nombre,
            votos: candidato.total_votos,
            partido: candidato.partido,
            movimiento: candidato.movimiento,
          })) || [];

  // Obtener municipios únicos para alcaldes
  const municipiosAlcaldes = [
    ...new Set(statsAlcaldes?.candidatos?.map((c: any) => c.municipio) || []),
  ] as string[];

  // Filtrar alcaldes por municipio
  const dataAlcaldes =
    filtroAlcaldes === "todos"
      ? statsAlcaldes?.candidatos
          ?.reduce((acc: any[], candidato: any) => {
            const existingMunicipio = acc.find(
              (item: any) => item.name === candidato.municipio
            );
            if (existingMunicipio) {
              existingMunicipio.votos += candidato.total_votos;
            } else {
              acc.push({
                name: candidato.municipio,
                votos: candidato.total_votos,
                partido: candidato.partido,
                movimiento: candidato.movimiento,
              });
            }
            return acc;
          }, [])
          .sort((a: any, b: any) => b.votos - a.votos)
          .slice(0, 15) || []
      : statsAlcaldes?.candidatos
          ?.filter((c: any) => c.municipio === filtroAlcaldes)
          .map((candidato: any) => ({
            name: candidato.nombre,
            votos: candidato.total_votos,
            partido: candidato.partido,
            movimiento: candidato.movimiento,
          }))
          .sort((a: any, b: any) => b.votos - a.votos) || [];

  const empatesAlcaldes =
    filtroAlcaldes === "todos" ? detectarEmpates(dataAlcaldes) : new Set();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = data.value
        ? dataPresidentes.reduce(
            (sum: number, item: any) => sum + item.value,
            0
          )
        : data.votos;
      const percentage = ((payload[0].value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow text-xs">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-gray-600">Partido: {data.partido}</p>
          <p className="text-gray-600">Movimiento: {data.movimiento}</p>
          <p className="text-gray-600">
            Votos: {payload[0].value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipDiputados = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow text-xs">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-gray-600">Partido: {data.partido}</p>
          <p className="text-gray-600">Movimiento: {data.movimiento}</p>
          <p className="text-blue-600 font-medium">Votos: {data.votos}</p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipAlcaldes = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const esEmpate =
        filtroAlcaldes === "todos" && empatesAlcaldes.has(data.name);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow text-xs">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-gray-600">Partido: {data.partido}</p>
          <p className="text-gray-600">Movimiento: {data.movimiento}</p>
          <p className="text-blue-600 font-medium">Votos: {data.votos}</p>
          {esEmpate && <p className="text-orange-600 font-medium">⚠️ Empate</p>}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry: any) => {
          // Buscar el candidato por nombre
          const candidato = dataPresidentes.find(
            (c: any) => c.name === entry.value
          );
          return (
            <div
              key={entry.value}
              className="flex items-center text-xs cursor-pointer group relative"
              title={`${candidato?.partido} - ${candidato?.movimiento}`}
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="font-medium">{entry.value}</span>
              <span className="text-gray-500 ml-1">
                ({candidato?.porcentaje?.toFixed(1)}%)
              </span>

              {/* Tooltip para leyenda */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                <p className="font-semibold">{candidato?.partido}</p>
                <p>{candidato?.movimiento}</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const CustomLegendDiputados = () => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center text-xs">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: COLORS[0] }}
          ></div>
          <span className="font-medium">Partido Nacional</span>
        </div>
        <div className="flex items-center text-xs">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: COLORS[1] }}
          ></div>
          <span className="font-medium">Partido Liberal</span>
        </div>
        <div className="flex items-center text-xs">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: COLORS[2] }}
          ></div>
          <span className="font-medium">Partido Libre</span>
        </div>
      </div>
    );
  };

  const CustomLegendAlcaldes = () => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center text-xs">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: COLORS[0] }}
          ></div>
          <span className="font-medium">Partido Nacional</span>
        </div>
        <div className="flex items-center text-xs">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: COLORS[1] }}
          ></div>
          <span className="font-medium">Partido Liberal</span>
        </div>
        <div className="flex items-center text-xs">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: COLORS[2] }}
          ></div>
          <span className="font-medium">Partido Libre</span>
        </div>
        {filtroAlcaldes === "todos" && empatesAlcaldes.size > 0 && (
          <div className="flex items-center text-xs">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: "#9CA3AF" }}
            ></div>
            <span className="font-medium">Empate</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <Navbar />

      <div className="container mx-auto px-4 py-6 z-50">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          📊 Estadísticas de Votación
        </h1>

        {/* Selector de Proceso de Votación */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                🗳️ Proceso de Votación
              </h3>
              <p className="text-sm text-gray-600">
                Selecciona el proceso de votación para ver sus estadísticas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={procesoSeleccionado}
                onChange={(e) => setProcesoSeleccionado(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {procesos.map((proceso) => (
                  <option key={proceso.id_proceso} value={proceso.id_proceso}>
                    Proceso #{proceso.id_proceso} - {proceso.etapa} (
                    {new Date(proceso.created_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
              {statsGenerales?.proceso && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Estado:</span>{" "}
                  {statsGenerales.proceso.etapa}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primera Fila - Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {statsGenerales?.totales?.total_general || 0}
            </div>
            <div className="text-sm text-gray-600">Total Votos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {statsGenerales?.totales?.votos_presidenciales || 0}
            </div>
            <div className="text-sm text-gray-600">Votos Presidenciales</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {statsGenerales?.totales?.votos_diputados || 0}
            </div>
            <div className="text-sm text-gray-600">Votos Diputados</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {statsGenerales?.totales?.votos_alcaldes || 0}
            </div>
            <div className="text-sm text-gray-600">Votos Alcaldes</div>
          </div>
        </div>

        {/* Segunda Fila - Presidentes y Diputados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de Presidentes */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              🏛️ Votos Presidenciales
            </h3>
            {dataPresidentes.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataPresidentes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => {
                        const candidato = dataPresidentes.find(
                          (c: any) => c.name === name
                        );
                        return `${name} ${
                          candidato?.porcentaje?.toFixed(1) || 0
                        }%`;
                      }}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataPresidentes.map((_: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos de votos presidenciales
              </div>
            )}
          </div>

          {/* Gráfico de Diputados */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                🏛️ Votos Diputados
              </h3>
              <select
                value={filtroDiputados}
                onChange={(e) => setFiltroDiputados(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="todos">Todos los Partidos</option>
                {partidosDiputados.map((partido: string) => (
                  <option key={partido} value={partido}>
                    {partido}
                  </option>
                ))}
              </select>
            </div>
            {dataDiputados.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataDiputados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      fontSize={9}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltipDiputados />} />
                    <Bar dataKey="votos">
                      {dataDiputados.map((entry: any, index: number) => {
                        let color = "#8884d8";
                        if (entry.partido === "Partido Nacional")
                          color = COLORS[0];
                        if (entry.partido === "Partido Liberal")
                          color = COLORS[1];
                        if (
                          entry.partido ===
                          "Partido Libertad y Refundación (LIBRE)"
                        )
                          color = COLORS[2];
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos de votos diputados para este partido
              </div>
            )}
            <CustomLegendDiputados />
            <div className="text-xs text-gray-500 mt-2 text-center">
              Mostrando {dataDiputados.length} de{" "}
              {statsDiputados?.candidatos?.length || 0} diputados
            </div>
          </div>
        </div>

        {/* Tercera Fila - Alcaldes por Municipio */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              🏘️ Votos Alcaldes - Santa Barbara
            </h3>
            <select
              value={filtroAlcaldes}
              onChange={(e) => setFiltroAlcaldes(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="todos">Todos los Municipios</option>
              {municipiosAlcaldes.map((municipio: string) => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
          </div>
          {dataAlcaldes.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataAlcaldes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltipAlcaldes />} />
                  <Bar dataKey="votos">
                    {dataAlcaldes.map((entry: any, index: number) => {
                      let color = "#8884d8";

                      // Si es "todos los municipios" y hay empates, usar color gris para empates
                      if (
                        filtroAlcaldes === "todos" &&
                        empatesAlcaldes.has(entry.name)
                      ) {
                        color = "#9CA3AF"; // Color gris para empates
                      } else {
                        // Lógica normal de colores por partido
                        if (entry.partido === "Partido Nacional")
                          color = COLORS[0];
                        if (entry.partido === "Partido Liberal")
                          color = COLORS[1];
                        if (
                          entry.partido ===
                          "Partido Libertad y Refundación (LIBRE)"
                        )
                          color = COLORS[2];
                      }

                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No hay datos de votos alcaldes para este municipio
            </div>
          )}
          <CustomLegendAlcaldes />
          <div className="text-xs text-gray-500 mt-2 text-center">
            {filtroAlcaldes === "todos"
              ? `Mostrando total de votos por municipio (${dataAlcaldes.length} municipios)`
              : `Candidatos en ${filtroAlcaldes}: ${dataAlcaldes.length}`}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Presidenciales */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-4xl mb-2">🎖️</div>
            <h4 className="text-lg font-bold text-blue-800 mb-1">
              Presidenciales
            </h4>
            <div className="text-xs text-blue-500">
              Candidatos:{" "}
              <span className="font-semibold">
                {statsPresidenciales?.candidatos?.length || 0}
              </span>
            </div>
          </div>
          {/* Diputados */}
          <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-4xl mb-2">🏛️</div>
            <h4 className="text-lg font-bold text-red-800 mb-1">Diputados</h4>
            <div className="text-xs text-red-500">
              Candidatos:{" "}
              <span className="font-semibold">
                {statsDiputados?.candidatos?.length || 0}
              </span>
              <br />
              Partidos:{" "}
              <span className="font-semibold">{partidosDiputados.length}</span>
            </div>
          </div>
          {/* Alcaldes */}
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-4xl mb-2">🏘️</div>
            <h4 className="text-lg font-bold text-green-800 mb-1">Alcaldes</h4>
            <div className="text-sm text-green-600 mb-1">Total votos</div>
            <div className="text-xs text-green-500">
              Candidatos:{" "}
              <span className="font-semibold">
                {statsAlcaldes?.candidatos?.length || 0}
              </span>
              <br />
              Municipios:{" "}
              <span className="font-semibold">{municipiosAlcaldes.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
