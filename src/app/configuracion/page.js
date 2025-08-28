"use client";
import { useEffect, useState } from "react";

export default function ConfiguracionPage() {
    const [usuario, setUsuario] = useState(null);
    const [form, setForm] = useState({ nombre: "", email: "" });
    const [passwords, setPasswords] = useState({ nueva: "", confirmar: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("usuario"));

        if (!token || !userData) {
            alert("Debes iniciar sesión primero 🙂");
            window.location.href = "/login";
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `http://localhost:4000/api/v1/usuarios/${userData.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();

                setUsuario(data.data);
                setForm({
                    nombre: data.data.nombre,
                    email: data.data.email,
                });
            } catch (error) {
                console.error("Error cargando usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("usuario"));

        // Validar contraseña si el usuario quiere cambiarla
        if (passwords.nueva || passwords.confirmar) {
            if (passwords.nueva !== passwords.confirmar) {
                alert("❌ Las contraseñas no coinciden");
                return;
            }
        }

        const payload = {
            ...form,
            ...(passwords.nueva ? { contrasena: passwords.nueva } : {}), // solo si hay nueva
        };

        try {
            const res = await fetch(
                `http://localhost:4000/api/v1/usuarios/${userData.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Error actualizando usuario");

            alert("✅ Usuario actualizado correctamente");
            setPasswords({ nueva: "", confirmar: "" });
        } catch (error) {
            console.error(error);
            alert("❌ No se pudo actualizar el usuario");
        }
    };

    const handleDelete = async () => {
        if (!confirm("⚠️ ¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
            return;
        }

        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("usuario"));

        try {
            const res = await fetch(
                `http://localhost:4000/api/v1/usuarios/${userData.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Error eliminando cuenta");

            alert("✅ Cuenta eliminada correctamente");
            localStorage.clear();
            window.location.href = "/";
        } catch (error) {
            console.error(error);
            alert("❌ No se pudo eliminar la cuenta");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="animate-pulse">Cargando perfil...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white px-6 sm:px-10 py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">
                ⚙️ Configuración de Usuario
            </h1>

            {usuario ? (
                <form
                    onSubmit={handleUpdate}
                    className="max-w-lg mx-auto bg-gray-800 p-6 rounded-xl shadow-md space-y-4"
                >
                    <div>
                        <label className="block text-sm mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
                        />
                    </div>

                    {/* Cambiar contraseña */}
                    <div>
                        <label className="block text-sm mb-1">Nueva contraseña</label>
                        <input
                            type="password"
                            name="nueva"
                            value={passwords.nueva}
                            onChange={handlePasswordChange}
                            placeholder="Escribe tu nueva contraseña"
                            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmar"
                            value={passwords.confirmar}
                            onChange={handlePasswordChange}
                            placeholder="Repite la nueva contraseña"
                            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
                        >
                            Guardar cambios
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold"
                        >
                            Eliminar cuenta
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-center text-gray-400">Usuario no encontrado</p>
            )}
        </main>
    );
}
