"use client";
import Link from "next/link";

export default function CategoriasPage() {
    const categorias = [
        "Acción",
        "Aventura",
        "Comedia",
        "Drama",
        "Fantasía",
        "Terror",
        "Romance",
        "Sci-Fi",
        "Animación",
        "Documental",
    ];

    return (
        <main className="min-h-screen bg-gray-950 text-white px-6 sm:px-10 py-10">
            <h1 className="text-4xl font-extrabold mb-10 text-center">
                🎭 Explora por <span className="text-blue-500">Categoría</span>
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categorias.map((cat) => (
                    <Link
                        key={cat}
                        href={`/categorias/${encodeURIComponent(cat)}`}
                        className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl text-center font-semibold transition shadow-md hover:shadow-xl"
                    >
                        {cat}
                    </Link>
                ))}
            </div>
        </main>
    );
}
