"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

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
        <main className="min-h-screen bg-gray-900 text-white px-8 py-10">
            <h1 className="text-3xl font-bold mb-6">🎬 Populares</h1>

            {populares.length === 0 ? (
                <p>No hay contenidos populares disponibles</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {populares.map((item) => (
                        <div
                            key={item._id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
                        >
                            <div className="relative w-full h-[350px]">
                                <Image
                                    src={item.poster}
                                    alt={item.titulo}
                                    fill
                                    className="object-"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="text-lg font-semibold truncate">{item.titulo}</h3>
                                <p className="text-sm text-gray-400">{item.anio}</p>
                                <p className="text-xs text-yellow-400 mt-1">
                                    ⭐ {item.ratingAvg ?? "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
