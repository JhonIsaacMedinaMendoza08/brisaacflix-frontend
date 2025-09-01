"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function LoginContent() {
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showRegister, setShowRegister] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("success") === "1") {
            setSuccessMessage("🎉 Usuario creado con éxito. Ahora puedes iniciar sesión.");
        }
    }, [searchParams]);

    // ---- LOGIN ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            const normalizedEmail = email.trim().toLowerCase();

            const res = await apiRequest("/usuarios/login", {
                method: "POST",
                body: { email: normalizedEmail, contrasena },
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

            router.push("/");
            window.location.href = "/";

        } catch (err) {
            console.error("Error en login:", err);
            setError("⚠️ Correo o contraseña incorrectos.");
        }
    };

    // ---- REGISTRO ----
    const [regData, setRegData] = useState({
        nombre: "",
        email: "",
        contrasena: "",
        rol: "user",
    });
    const [regError, setRegError] = useState("");

    const handleRegisterChange = (e) => {
        setRegData({ ...regData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError("");

        try {
            await apiRequest("/usuarios/register", {
                method: "POST",
                body: regData,
            });

            router.push("/login?success=1");
            window.location.href = "/login?success=1";

        } catch (err) {
            console.error("Error en registro:", err);
            setRegError("❌ Error al registrarse. Verifica la información.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
                {!showRegister ? (
                    <>
                        <h2 className="text-2xl font-bold text-white text-center mb-6">
                            Iniciar sesión
                        </h2>

                        {successMessage && (
                            <p className="text-green-400 text-center mb-4">{successMessage}</p>
                        )}

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

                        <p className="text-center text-gray-400 mt-6">
                            ¿No tienes usuario?{" "}
                            <button
                                onClick={() => setShowRegister(true)}
                                className="text-blue-400 hover:underline"
                            >
                                Crea uno 🎉
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white text-center mb-6">
                            Crear cuenta
                        </h2>
                        {regError && <p className="text-red-400 text-center mb-4">{regError}</p>}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-gray-300">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={regData.nombre}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300">Correo</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={regData.email}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300">Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    value={regData.contrasena}
                                    onChange={handleRegisterChange}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                            >
                                Registrarme
                            </button>
                        </form>

                        <p className="text-center text-gray-400 mt-6">
                            ¿Ya tienes usuario?{" "}
                            <button
                                onClick={() => setShowRegister(false)}
                                className="text-blue-400 hover:underline"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
