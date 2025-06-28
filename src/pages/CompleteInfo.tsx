import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logoRNP.png";
import BubbleBackground from "../components/BubbleBackground";

export default function CompleteInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const noIdentidad = location.state?.no_identidad || "";

  const [formData, setFormData] = useState({
    nombre: "",
    municipio_id: "",
  });

  const [municipios, setMunicipios] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = "https://votingbackend-fe5a580c2b2c.herokuapp.com/api";

  // Cargar departamentos al montar el componente
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const response = await fetch(`${baseUrl}/departamentos`);
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      alert("Error cargando departamentos: " + error);
    }
  };

  const fetchMunicipios = async (departamentoId: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/municipios/departamento/${departamentoId}`
      );
      const data = await response.json();
      setMunicipios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando municipios:", error);
    }
  };

  const handleDepartamentoChange = (departamentoId: string) => {
    setFormData({ ...formData, municipio_id: "" });
    if (departamentoId) {
      fetchMunicipios(departamentoId);
    } else {
      setMunicipios([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          no_identidad: noIdentidad,
          nombre: formData.nombre,
          municipio_id: formData.municipio_id,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        alert("Registro completado correctamente");
      } else {
        alert("Error al completar el registro");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            id_persona: data.id_persona,
            nombre: data.nombre,
            no_identidad: data.no_identidad,
            municipio_id: data.municipio_id,
            departamento_id: data.departamento_id,
            municipio_nombre: data.municipio_nombre,
            departamento_nombre: data.departamento_nombre,
          })
        );
        navigate("/home");
      } else {
        alert("Error al completar el registro");
      }
    } catch (error) {
      alert("Error al completar el registro: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-white overflow-hidden">
      <BubbleBackground />

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="z-10 bg-white p-8 rounded shadow-md w-96 text-center relative"
      >
        <img src={logo} alt="Logo RNP" className="mx-auto mb-6 w-250" />

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Completar Información
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          No. de Identidad: <span className="font-semibold">{noIdentidad}</span>
        </p>

        <input
          type="text"
          placeholder="Nombre completo"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />

        <select
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => handleDepartamentoChange(e.target.value)}
          required
        >
          <option value="">Seleccionar Departamento</option>
          {departamentos.map((depto: any) => (
            <option key={depto.id_departamento} value={depto.id_departamento}>
              {depto.nombre}
            </option>
          ))}
        </select>

        <select
          className="w-full mb-6 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.municipio_id}
          onChange={(e) =>
            setFormData({ ...formData, municipio_id: e.target.value })
          }
          required
          disabled={!formData.municipio_id && municipios.length === 0}
        >
          <option value="">Seleccionar Municipio</option>
          {municipios.map((mun: any) => (
            <option key={mun.id_municipio} value={mun.id_municipio}>
              {mun.nombre}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Completando..." : "Completar Registro"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          Volver al Login
        </button>
      </form>
    </div>
  );
}
