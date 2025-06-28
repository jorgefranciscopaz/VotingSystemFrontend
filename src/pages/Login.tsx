import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logoRNP.png";
import BubbleBackground from "../components/BubbleBackground"; // Ajusta la ruta si es necesario

export default function Login() {
  const navigate = useNavigate();
  const baseUrl = "https://votingbackend-fe5a580c2b2c.herokuapp.com/api";

  const [loginValues, setLoginValues] = useState({
    id: "",
    password: "",
  });

  const getPersonByID = async (id: string) => {
    const response = await fetch(`${baseUrl}/personas/no-identidad/${id}`);
    const data = await response.json();
    return data;
  };

  const UserLogin = async () => {
    const response = await fetch(`${baseUrl}/login`, {
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
          localStorage.setItem("token", response.token);
          localStorage.setItem(
            "userData",
            JSON.stringify({
              id_persona: response.id_persona,
              nombre: response.nombre,
              no_identidad: response.no_identidad,
              municipio_id: response.municipio_id,
              departamento_id: response.departamento_id,
            })
          );
          navigate("/home");
        } else {
          navigate("/complete-info", {
            state: { no_identidad: loginValues.id },
          });
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

        <input
          type={loginValues.id.includes("@") ? "email" : "text"}
          placeholder={
            loginValues.id.includes("@")
              ? "Correo electrónico"
              : "No. de Identidad"
          }
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={loginValues.id}
          onChange={(e) =>
            setLoginValues({ ...loginValues, id: e.target.value })
          }
        />

        {loginValues.id.includes("@") && (
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={loginValues.password}
            onChange={(e) =>
              setLoginValues({ ...loginValues, password: e.target.value })
            }
          />
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
