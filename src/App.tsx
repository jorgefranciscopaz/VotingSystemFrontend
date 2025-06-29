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
import VoteProcessPage from "./pages/VoteProcessPage";
import VoteSummary from "./pages/VoteSummary";
import VotoExitoso from "./pages/VotoExitoso";

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
        <Route path="/votar/resumen" element={<VoteSummary />} />
        <Route path="/voto-exitoso" element={<VotoExitoso />} />
        <Route path="/estadisticas" element={<Stats />} />
        <Route path="/algoritmos" element={<Algorithms />} />
        <Route path="/proceso-votacion" element={<VoteProcessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
