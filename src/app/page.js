"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiRequest("/login", "POST", { email, contrasena });

      // guardar token y usuario en localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      // redirigir según el rol
      if (res.data.usuario.rol === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      setError(err.message || "Error en inicio de sesión");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-red-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-red text-center mb-6">Iniciar sesión</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
