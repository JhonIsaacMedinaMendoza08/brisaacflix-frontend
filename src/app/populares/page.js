"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PopularesPage() {
    const [populares, setPopulares] = useState([]);

    useEffect(() => {
        const fetchPopulares = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/v1/contenido/populares");
                const data = await res.json();

                // Aseguramos que venga como array
                const dataAPI = Array.isArray(data.data) ? data.data : [];
                setPopulares(dataAPI);
            } catch (error) {
                console.error("Error cargando populares:", error);
            }
        };

        fetchPopulares();
    }, []);

    return (
        <main className="min-h-screen bg-gray-950 text-white px-6 sm:px-10 py-10">
            {/* Título */}
            <h1 className="text-4xl font-extrabold mb-10 text-center">
                🔥 Ranking de <span className="text-blue-500">Populares</span>
            </h1>

            {/* Contenidos Populares */}
            {populares.length === 0 ? (
                <p className="text-center text-gray-400">
                    No hay contenidos populares disponibles 😢
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {populares.map((item, index) => (
                        <Link
                            key={item._id}
                            href={`/contenido/${item._id}`} // Redirige al detalle
                            className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                        >
                            {/* Poster con ranking */}
                            <div className="relative w-full h-[350px]">
                                <Image
                                    src={item.poster}
                                    alt={item.titulo}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Overlay degradado */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition"></div>
                                {/* Badge Ranking */}
                                <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold px-3 py-1 rounded-lg shadow-md">
                                    #{index + 1}
                                </span>
                            </div>

                            {/* Info */}
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
