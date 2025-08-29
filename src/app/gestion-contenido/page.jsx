"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function GestionContenido() {
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  // Calcular indices
  const indiceInicial = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicial + elementosPorPagina;
  const contenidosPaginados = contenidos.slice(indiceInicial, indiceFinal);

  const totalPaginas = Math.ceil(contenidos.length / elementosPorPagina);

  // 🔹 Cargar contenido desde backend
  useEffect(() => {
    const fetchContenidos = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const token = localStorage.getItem("token");

        if (!usuario || !token) {
          setError("No hay usuario logueado");
          setLoading(false);
          return;
        }

        // Traer TODO el contenido
        const res = await apiRequest(
          `/contenido/${usuario.id}/admin/listado`,
          { method: "GET" }
        );

        setContenidos(res.data || []);
      } catch (err) {
        console.error("Error al traer contenidos:", err);
        setError(err.message || "Error en la petición");
      } finally {
        setLoading(false);
      }
    };

    fetchContenidos();
  }, []);

  // 🔹 Acciones
  const aprobar = async (id) => {
    try {
      await apiRequest(`/contenido/${id}/aprobar`, { method: "PUT" });
      setContenidos((prev) =>
        prev.map((c) => (c._id === id ? { ...c, estado: "aprobado" } : c))
      );
    } catch (err) {
      alert("Error al aprobar: " + err.message);
    }
  };

  const rechazar = async (id) => {
    try {
      await apiRequest(`/contenido/${id}/rechazar`, { method: "PUT" });
      setContenidos((prev) =>
        prev.map((c) => (c._id === id ? { ...c, estado: "rechazado" } : c))
      );
    } catch (err) {
      alert("Error al rechazar: " + err.message);
    }
  };

  const eliminar = async (id) => {
    try {
      await apiRequest(`/contenido/${id}`, { method: "DELETE" });
      setContenidos((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  // 🔹 Render
  if (loading) return <p className="text-white mt-24">Cargando contenido...</p>;
  if (error) return <p className="text-red-400 mt-24">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-24 px-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Gestión de Contenido
      </h1>

      <div className="bg-gray-900 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Título</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contenidosPaginados.map((c) => (
              <tr key={c._id} className="border-b border-gray-700">
                <td className="p-3">{c._id}</td>
                <td className="p-3">{c.titulo}</td>
                <td className="p-3">{c.tipo}</td>
                <td className="p-3">{c.estado}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => aprobar(c._id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => rechazar(c._id)}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => eliminar(c._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {contenidosPaginados.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-400">
                  No hay contenido disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Controles de paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 text-white">
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      )}
    </div>
  );
}
