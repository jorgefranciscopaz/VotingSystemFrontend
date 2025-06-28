import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logoRNP.png";
import BubbleBackground from "../components/BubbleBackground"; // Ajusta la ruta si es necesario
import { parseJwt } from "../utils/parseJWT";

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [loginValues, setLoginValues] = useState({
    id: "",
    password: "",
  });

  const getPersonByID = async (id: string) => {
    const response = await fetch(
      `http://localhost:8000/api/personas/no-identidad/${id}`
    );
    const data = await response.json();
    return data;
  };

  const UserLogin = async () => {
    const response = await fetch(`http://localhost:8000/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        correo: loginValues.id,
        contrasena: loginValues.password,
      }),
    });
    const data = await response.json();
    return data;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginValues.id.includes("@")) {
      try {
        const response = await getPersonByID(loginValues.id);

        if (response && response.id_persona) {
          alert("Persona encontrada: " + response.nombre);
          navigate("/home");
        } else {
          //TODO: rellenar los datos restantes de la persona, para despues poder hacer el login solo con id
          navigate("/fill-info");
        }
      } catch (error) {
        alert("Error al buscar persona: " + error);
      }
    } else {
      const response = await UserLogin();
      if (response.id_usuario) {
        localStorage.setItem("token", response.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            id_usuario: response.id_usuario,
            correo: response.correo,
            id_persona: response.id_persona,
            nombre: response.nombre,
            no_identidad: response.no_identidad,
            municipio_id: response.municipio_id,
            departamento_id: response.departamento_id,
          })
        );
        alert(localStorage.getItem("userData"));
        navigate("/home");
      } else {
        alert("Login fallido");
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-white overflow-hidden">
      <BubbleBackground />

      {/* Formulario */}
      <form
        onSubmit={handleLogin}
        className="z-10 bg-white p-8 rounded shadow-md w-80 text-center relative"
      >
        <img src={logo} alt="Logo RNP" className="mx-auto mb-6 w-250" />

        {!loginValues.id.includes("@") && (
          <input
            type="text"
            placeholder="No. de Identidad"
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={loginValues.id}
            onChange={(e) =>
              setLoginValues({ ...loginValues, id: e.target.value })
            }
          />
        )}

        {loginValues.id.includes("@") && (
          <>
            <input
              type="text"
              placeholder="Correo"
              className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={loginValues.id}
              onChange={(e) =>
                setLoginValues({ ...loginValues, id: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={loginValues.password}
              onChange={(e) =>
                setLoginValues({ ...loginValues, password: e.target.value })
              }
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
