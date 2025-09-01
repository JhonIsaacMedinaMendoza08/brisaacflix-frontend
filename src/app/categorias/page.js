"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/v1/contenido/generos");
                const data = await res.json();

                if (data.ok && Array.isArray(data.data)) {
                    // 🔹 Filtrar aprobadas (aceptando "aprobado", "Aprobado", true, etc.)
                    const aprobadas = data.data.filter(
                        (cat) =>
                            cat.estado &&
                            (cat.estado.toLowerCase?.() === "aprobado" || cat.estado === true)
                    );

                    // Si no hay "estado", mejor tomamos todas las categorías
                    const filtradas = aprobadas.length > 0 ? aprobadas : data.data;

                    // 🔹 Quitar duplicados por nombre
                    const unicas = Array.from(
                        new Map(
                            filtradas.map((cat) => [cat.name.toLowerCase(), cat])
                        ).values()
                    );

                    setCategorias(unicas);
                }
            } catch (error) {
                console.error("Error cargando categorías:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="animate-pulse">Cargando categorías...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white px-6 sm:px-10 py-10">
            <h1 className="text-4xl font-extrabold mb-10 text-center">
                🎭 Explora por <span className="text-blue-500">Categoría</span>
            </h1>

            {categorias.length === 0 ? (
                <p className="text-center text-gray-400">
                    No hay categorías disponibles 😢
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categorias.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categorias/${encodeURIComponent(cat.name)}`}
                            className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl text-center font-semibold transition shadow-md hover:shadow-xl"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
