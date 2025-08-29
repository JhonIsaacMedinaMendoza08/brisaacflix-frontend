"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario) throw new Error("No hay usuario logueado");

        const token = localStorage.getItem("token");
        const res = await apiRequest("/usuarios", "GET", null, token);
        setUsuarios(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <p className="text-white">Cargando usuarios...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl text-white mb-4">Gestión de Usuarios</h1>
      <table className="w-full bg-gray-800 rounded-xl">
        <thead>
          <tr>
            <th className="p-3 text-left text-gray-300">Nombre</th>
            <th className="p-3 text-left text-gray-300">Email</th>
            <th className="p-3 text-left text-gray-300">Rol</th>
            <th className="p-3 text-left text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id} className="border-b border-gray-700">
              <td className="p-3 text-white">{u.nombre}</td>
              <td className="p-3 text-gray-300">{u.email}</td>
              <td className="p-3 text-gray-300">{u.rol}</td>
              <td className="p-3">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await apiRequest(`/usuarios/${u._id}`, "DELETE", null, token);
                      setUsuarios((prev) => prev.filter((x) => x._id !== u._id));
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                  className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
