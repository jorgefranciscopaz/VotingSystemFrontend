import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const baseUrl = "https://votingbackend-fe5a580c2b2c.herokuapp.com/api";

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const tieneCorreo = userData.correo;
  const [procesoVotacion, setProcesoVotacion] = useState<any>(null);

  useEffect(() => {
    fetchProcesoVotacion();
  }, []);

  const fetchProcesoVotacion = async () => {
    try {
      const response = await fetch(`${baseUrl}/proceso-votacion`);
      const data = await response.json();

      if (data && data.length > 0) {
        const ultimoProceso = data[data.length - 1];
        setProcesoVotacion(ultimoProceso);
      }
    } catch (error) {
      console.error("Error al obtener el proceso de votación:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/");
        return;
      }

      const response = await fetch(`${baseUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      if (response.ok) {
        console.log("Logout exitoso");
      } else {
        console.log("Error en logout del servidor, pero sesión local limpiada");
      }

      navigate("/");
    } catch (error) {
      console.error("Error durante logout:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center fixed w-full top-0 z-50">
      <div className="flex items-center space-x-4">
        <img src="/src/assets/logoRNP.png" alt="Logo RNP" className="h-12" />
        <h1 className="text-xl font-bold text-blue-800">VotingSystem</h1>
      </div>
      <div className="flex items-center space-x-4">
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/home" className="text-gray-600 hover:text-gray-900">
              Votar
            </Link>
          </li>

          {/* Mostrar estadísticas según el tipo de usuario y estado del proceso */}
          {(tieneCorreo || procesoVotacion?.etapa === "Postvotacion") && (
            <li>
              <Link
                to="/estadisticas"
                className="text-gray-600 hover:text-gray-900"
              >
                Estadísticas
              </Link>
            </li>
          )}

          {tieneCorreo && (
            <li>
              <Link
                to="/proceso-votacion"
                className="text-gray-600 hover:text-gray-900"
              >
                Proceso de Votación
              </Link>
            </li>
          )}

          {localStorage.getItem("userData") && (
            <li
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 cursor-pointer"
            >
              Logout
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
