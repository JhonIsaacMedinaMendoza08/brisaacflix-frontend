"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Iconos (ya vienen en shadcn/lucide)

export default function Header() {
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() === "") return;
        console.log("Buscando:", query);
        // 🔹 Aquí luego conectas con tu backend o TMDB API
    };

    return (
        <header className="w-full bg-gray-950 text-white shadow-md fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-500">
                    Brisaac<span className="text-white">Flix</span>
                </Link>

                {/* NAV DESKTOP */}
                <nav className="hidden md:flex gap-6 text-gray-300">
                    <Link href="/peliculas" className="hover:text-white">Películas</Link>
                    <Link href="/series" className="hover:text-white">Series</Link>
                    <Link href="/populares" className="hover:text-white">Populares</Link>
                    <Link href="/categorias" className="hover:text-white">Categorías</Link>
                </nav>

                {/* Barra de búsqueda (desktop) */}
                <form
                    onSubmit={handleSearch}
                    className="hidden md:flex items-center bg-gray-800 rounded-md overflow-hidden"
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar película, serie..."
                        className="px-4 py-2 w-48 sm:w-64 bg-gray-800 text-sm focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold"
                    >
                        Buscar
                    </button>
                </form>

                {/* Botón login (desktop) */}
                <div className="hidden md:block">
                    <Link
                        href="/login"
                        className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold"
                    >
                        Iniciar sesión
                    </Link>
                </div>

                {/* ICONO HAMBURGUESA (mobile) */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-white focus:outline-none"
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* MENU MOBILE */}
            {menuOpen && (
                <div className="md:hidden bg-gray-900 px-6 pb-6">
                    <nav className="flex flex-col gap-4 py-4 text-gray-300">
                        <Link href="/peliculas" className="hover:text-white">Películas</Link>
                        <Link href="/series" className="hover:text-white">Series</Link>
                        <Link href="/populares" className="hover:text-white">Populares</Link>
                        <Link href="/categorias" className="hover:text-white">Categorías</Link>
                    </nav>

                    {/* Barra de búsqueda (mobile) */}
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center bg-gray-800 rounded-md overflow-hidden mt-4"
                    >
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar..."
                            className="px-4 py-2 w-full bg-gray-800 text-sm focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold"
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Botón login (mobile) */}
                    <Link
                        href="/login"
                        className="block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-center text-sm font-semibold"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            )}
        </header>
    );
}
