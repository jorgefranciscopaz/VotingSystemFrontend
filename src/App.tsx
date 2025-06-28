import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CompleteInfo from "./pages/CompleteInfo";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage"; // nueva línea
import PresidentePage from "./pages/PresidentePage";
import AlcaldePage from "./pages/AlcaldePage";
import DiputadoPage from "./pages/DiputadoPage";
import Stats from "./pages/Stats";
import Algorithms from "./pages/Algorithms";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/complete-info" element={<CompleteInfo />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* nueva ruta */}
        <Route path="/votar/presidente" element={<PresidentePage />} />
        <Route path="/votar/alcalde" element={<AlcaldePage />} />
        <Route path="/votar/diputado" element={<DiputadoPage />} />
        <Route path="/estadisticas" element={<Stats />} />
        <Route path="/algoritmos" element={<Algorithms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
