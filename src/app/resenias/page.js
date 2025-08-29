"use client";
import { useState, useEffect } from "react";

export default function MisResenias() {
    const [resenias, setResenias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedResenia, setSelectedResenia] = useState(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const usuario = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("usuario") || "{}")
        : {};

    // 🔹 Cargar reseñas del usuario autenticado
    useEffect(() => {
        if (!token || !usuario.id) {
            setError("Debes iniciar sesión para ver tus reseñas.");
            setLoading(false);
            return;
        }

        const fetchResenias = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/v1/resenias/usuario/${usuario.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Error al obtener reseñas");

                if (Array.isArray(data)) {
                    setResenias(data);
                } else if (data.data && Array.isArray(data.data)) {
                    setResenias(data.data);
                } else {
                    setResenias([data]);
                }
            } catch (err) {
                console.error("❌ Error cargando reseñas:", err);
                setError("No se pudieron cargar tus reseñas.");
            } finally {
                setLoading(false);
            }
        };

        fetchResenias();
    }, []);

    // 🔹 Eliminar reseña
    const eliminarResenia = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar esta reseña?")) return;

        try {
            const res = await fetch(`http://localhost:4000/api/v1/resenias/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Error eliminando reseña");

            setResenias(resenias.filter((r) => r._id !== id));
            alert("✅ Reseña eliminada correctamente");
        } catch (err) {
            console.error(err);
            alert("❌ No se pudo eliminar la reseña");
        }
    };

    // 🔹 Abrir modal con datos de la reseña
    const abrirModal = (resenia) => {
        setSelectedResenia({ ...resenia }); // copia para editar
        setShowModal(true);
    };

    // 🔹 Guardar edición
    const guardarEdicion = async () => {
        try {
            const id = selectedResenia._id; // 🔹 usar _id
            const res = await fetch(`http://localhost:4000/api/v1/resenias/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    titulo: selectedResenia.titulo,
                    comentario: selectedResenia.comentario,
                    calificacion: selectedResenia.calificacion,
                }),
            });

            if (!res.ok) throw new Error("Error editando reseña");

            setResenias(
                resenias.map((r) =>
                    r._id === id ? selectedResenia : r
                )
            );
            setShowModal(false);
            alert("✏️ Reseña actualizada correctamente");
        } catch (err) {
            console.error(err);
            alert("❌ No se pudo editar la reseña");
        }
    };

    if (loading) return <p className="text-center text-gray-400">Cargando reseñas...</p>;
    if (error) return <p className="text-center text-red-400">{error}</p>;

    return (
        <main className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">📝 Mis Reseñas</h1>

            {resenias.length === 0 ? (
                <p className="text-center text-gray-400">No has creado reseñas aún.</p>
            ) : (
                <div className="grid gap-4 max-w-4xl mx-auto">
                    {resenias.map((r) => (
                        <div
                            key={r._id}
                            className="bg-gray-800 p-4 rounded-xl shadow flex justify-between items-start"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{r.titulo}</h2>
                                <p className="text-gray-400">⭐ {r.calificacion}/10</p>
                                <p className="mt-2">{r.comentario}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => abrirModal(r)}
                                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => eliminarResenia(r._id)}
                                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🔹 Modal */}
            {showModal && selectedResenia && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">✏️ Editar Reseña</h2>

                        <label className="block mb-2">Título</label>
                        <input
                            type="text"
                            value={selectedResenia.titulo}
                            onChange={(e) =>
                                setSelectedResenia({ ...selectedResenia, titulo: e.target.value })
                            }
                            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                        />

                        <label className="block mb-2">Comentario</label>
                        <textarea
                            value={selectedResenia.comentario}
                            onChange={(e) =>
                                setSelectedResenia({ ...selectedResenia, comentario: e.target.value })
                            }
                            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                        />

                        <label className="block mb-2">Calificación (1-10)</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={selectedResenia.calificacion}
                            onChange={(e) =>
                                setSelectedResenia({
                                    ...selectedResenia,
                                    calificacion: Number(e.target.value),
                                })
                            }
                            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardarEdicion}
                                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
