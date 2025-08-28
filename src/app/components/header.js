"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [usuario, setUsuario] = useState(null);

    // 🔹 Verificar token y usuario en localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("usuario");

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUsuario({ ...parsedUser, token });
                } catch (err) {
                    console.error("Error parseando usuario:", err);
                }
            }
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() === "") return;
        console.log("Buscando:", query);
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

                    {/* 🔹 Crear contenido solo si usuario con rol:user */}
                    {usuario?.rol === "user" && (
                        <Link
                            href="/crear-contenido"
                            className="hover:text-white font-semibold text-blue-400"
                        >
                            Crear contenido
                        </Link>
                    )}
                    {usuario?.rol === "user" && (
                        <Link
                            href="/configuracion"
                            className="hover:text-white font-semibold text-blue-400"
                        >
                            Configuracion
                        </Link>
                    )}
                    {usuario?.rol === "admin" && (
                        <Link
                            href="/gestion-usuarios"
                            className="hover:text-white font-semibold text-blue-400"
                        >
                            Gestion de usuarios
                        </Link>
                    )}
                    {usuario?.rol === "admin" && (
                        <Link
                            href="/gestion-contenido"
                            className="hover:text-white font-semibold text-blue-400"
                        >
                            Gestion de contenido
                        </Link>
                    )}
                </nav>

                {/* Botón login/logout (desktop) */}
                <div className="hidden md:block">
                    {!usuario ? (
                        <Link
                            href="/login"
                            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold"
                        >
                            Iniciar sesión
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("usuario");
                                setUsuario(null);
                            }}
                            className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold"
                        >
                            Cerrar sesión
                        </button>
                    )}
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

                        {/* 🔹 Crear contenido solo si rol:user */}
                        {usuario?.rol === "user" && (
                            <Link
                                href="/crear-contenido"
                                className="hover:text-white font-semibold text-blue-400"
                            >
                                Crear contenido
                            </Link>
                        )}
                        {usuario?.rol === "user" && (
                        <Link
                            href="/crear-contenido"
                            className="hover:text-white font-semibold text-blue-400"
                        >
                            Configuracion
                        </Link>
                    )}
                    {usuario?.rol === "admin" && (
                        <Link
                            href="/gestion-usuarios"
                            className="hover:text-white font-semibold text-blue-400"
                        >
                            Gestion de usuarios
                        </Link>
                    )}
                    {usuario?.rol === "admin" && (
                        <Link
                            href="/gestion-contenido"
                            className="hover:text-white font-semibold text-blue-400"
                        >
                            Gestion de contenido
                        </Link>
                    )}
                    </nav>


                    {/* Botón login/logout (mobile) */}
                    {!usuario ? (
                        <Link
                            href="/login"
                            className="block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-center text-sm font-semibold"
                        >
                            Iniciar sesión
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("usuario");
                                setUsuario(null);
                            }}
                            className="block mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-center text-sm font-semibold"
                        >
                            Cerrar sesión
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}
