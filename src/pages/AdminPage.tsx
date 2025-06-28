import Navbar from "../components/Navbar";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar global */}
      <Navbar />

      {/* Contenedor principal */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Botón Iniciar Votaciones */}
        <div className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-6 rounded-lg shadow-md text-center cursor-pointer">
          <h2 className="text-xl">Iniciar Votaciones</h2>
        </div>

        {/* Botón Finalizar Votaciones */}
        <div className="bg-green-500 hover:bg-green-600 text-white font-semibold p-6 rounded-lg shadow-md text-center cursor-pointer">
          <h2 className="text-xl">Finalizar Votaciones</h2>
        </div>

        {/* Botón Estadísticas */}
        <div className="md:col-span-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-6 rounded-lg shadow-md text-center cursor-pointer">
          <h2 className="text-xl">Ver Estadísticas de Votaciones</h2>
        </div>
      </main>
    </div>
  );
}
