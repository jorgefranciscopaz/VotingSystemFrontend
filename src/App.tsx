import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage"; // nueva línea

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* nueva ruta */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
