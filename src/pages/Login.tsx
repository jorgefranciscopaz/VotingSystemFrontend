import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logoRNP.png"; // Asegúrate de que esta ruta apunte a tu imagen

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === "admin" && password === "admin") {
      setShowAccessKey(true);
      if (accessKey === "123") {
        navigate("/admin");
      } else if (accessKey !== "") {
        setError("Clave de acceso incorrecta");
      }
    } else {
      if (id && password) {
        navigate("/home");
      } else {
        setError("Por favor complete todos los campos");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen splash-animated-bg">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-80 text-center"
      >
        <img src={logo}alt="Logo RNP" className="mx-auto mb-6 w-500" />
        <input
          type="text"
          placeholder="ID"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {showAccessKey && (
          <input
            type="password"
            placeholder="Clave de acceso"
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
          />
        )}
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
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
