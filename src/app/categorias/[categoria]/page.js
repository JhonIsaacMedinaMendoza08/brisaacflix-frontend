"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CategoriaPage() {
    const { categoria } = useParams();
    const [contenidos, setContenidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoria = async () => {
            try {
                const res = await fetch(
                    `http://localhost:4000/api/v1/contenido/categoria/${encodeURIComponent(categoria)}`
                );
                const data = await res.json();

                const dataAPI = Array.isArray(data.data) ? data.data : [];
                const aprobados = dataAPI.filter((item) => item.estado === "aprobado");

                setContenidos(aprobados);
            } catch (error) {
                console.error("Error cargando categoría:", error);
            } finally {
                setLoading(false);
            }
        };

        if (categoria) fetchCategoria();
    }, [categoria]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="animate-pulse">Cargando...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white px-6 sm:px-10 py-10">
            <h1 className="text-4xl font-extrabold mb-10 text-center">
                🎭 {decodeURIComponent(categoria)}
            </h1>

            {contenidos.length === 0 ? (
                <p className="text-center text-gray-400">
                    No hay contenidos aprobados en esta categoría 😢
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {contenidos.map((item) => (
                        <Link
                            key={item._id}
                            href={`/contenido/${item._id}`}
                            className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                        >
                            <div className="relative w-full h-[350px]">
                                <Image
                                    src={item.poster}
                                    alt={item.titulo}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition"></div>
                            </div>

                            <div className="absolute bottom-0 w-full p-4">
                                <h3 className="text-lg font-bold truncate group-hover:text-blue-400">
                                    {item.titulo}
                                </h3>
                                <div className="flex justify-between items-center text-sm mt-1 text-gray-300">
                                    <span>{item.anio}</span>
                                    <span className="text-yellow-400 font-semibold">
                                        ⭐ {item.ratingAvg?.toFixed(1) ?? "N/A"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
