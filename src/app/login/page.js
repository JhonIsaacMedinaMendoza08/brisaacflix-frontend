"use client";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validaciones simples en frontend
        if (!email || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error en el login");
            }

            // ✅ Guardamos token en localStorage
            localStorage.setItem("token", data.token);

            // Redirigir al home (ejemplo)
            window.location.href = "/";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96 space-y-6"
            >
                <h1 className="text-2xl font-bold text-white text-center">Iniciar sesión</h1>

                {error && <p className="text-red-400 text-center">{error}</p>}

                <div>
                    <label className="block text-gray-300">Correo</label>
                    <input
                        type="email"
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                    />
                </div>

                <div>
                    <label className="block text-gray-300">Contraseña</label>
                    <input
                        type="password"
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 rounded transition disabled:opacity-50"
                >
                    {loading ? "Cargando..." : "Ingresar"}
                </button>
            </form>
        </div>
    );
}
