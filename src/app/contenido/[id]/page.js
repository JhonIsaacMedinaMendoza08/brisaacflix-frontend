"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ContenidoDetalle() {
    const { id } = useParams();
    const [contenido, setContenido] = useState(null);
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Obtener detalle del contenido
    useEffect(() => {
        const fetchContenido = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/v1/contenido/${id}`);
                const data = await res.json();
                setContenido(data.data);
            } catch (error) {
                console.error("Error cargando detalle:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchContenido();
    }, [id]);

    // 🔹 Obtener reseñas del contenido
    useEffect(() => {
        const fetchResenas = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/v1/resenias`);
                const data = await res.json();

                // Filtrar solo reseñas de este contenido
                const filtradas = data.data.filter(
                    (r) => r.contenidoId === id // asegúrate que el campo se llame contenidoId
                );
                setResenas(filtradas);
            } catch (error) {
                console.error("Error cargando reseñas:", error);
            }
        };

        if (id) fetchResenas();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="text-lg animate-pulse">Cargando...</p>
            </main>
        );
    }

    if (!contenido) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="text-lg">No se encontró el contenido.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-900 text-white">
            {/* Hero con background difuminado */}
            <section className="relative h-[500px] w-full">
                <Image
                    src={contenido.poster}
                    alt={contenido.titulo}
                    fill
                    className="object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/60 to-transparent" />
            </section>

            {/* Info principal */}
            <section className="relative -mt-40 z-10 max-w-6xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Poster */}
                    <div className="relative w-full h-[450px] md:h-[550px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={contenido.poster}
                            alt={contenido.titulo}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {contenido.titulo}{" "}
                            <span className="text-gray-400 text-2xl">({contenido.anio})</span>
                        </h1>

                        {/* Géneros */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {contenido.generos?.map((g) => (
                                <span
                                    key={g.id}
                                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                                >
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        {/* Rating & Popularidad */}
                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex flex-col">
                                <span className="text-yellow-400 font-bold text-lg">
                                    ⭐ {contenido.ratingAvg?.toFixed(1) || "N/A"}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {contenido.ratingCount} votos
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-green-400 font-bold text-lg">
                                    🔥 {contenido.popularidad}
                                </span>
                                <span className="text-sm text-gray-400">Popularidad</span>
                            </div>
                        </div>

                        {/* Sinopsis */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2">Sinopsis</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {contenido.sinopsis || "Sin sinopsis disponible."}
                            </p>
                        </div>

                        {/* Botón para escribir reseña */}
                        <div className="mt-6 flex gap-4">
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                                + Escribir una reseña
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reseñas */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                <h2 className="text-2xl font-semibold mb-6">Reseñas de usuarios</h2>

                {resenas.length === 0 ? (
                    <p className="text-gray-400">
                        No hay reseñas todavía. ¡Sé el primero en opinar!
                    </p>
                ) : (
                    <div className="space-y-6">
                        {resenas.map((r) => (
                            <div
                                key={r._id}
                                className="bg-gray-800 p-5 rounded-lg shadow-md hover:bg-gray-700 transition"
                            >
                                {/* Cabecera reseña */}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg">{r.titulo}</h3>
                                    <span className="text-yellow-400 font-bold">
                                        ⭐ {r.calificacion}/10
                                    </span>
                                </div>

                                {/* Comentario */}
                                <p className="text-gray-300 mb-3">{r.comentario}</p>

                                {/* Info extra */}
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>Publicado: {new Date(r.createdAt).toLocaleDateString()}</span>
                                    <div className="flex gap-4">
                                        <span>👍 {r.likesUsuarios?.length || 0}</span>
                                        <span>👎 {r.dislikesUsuarios?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
