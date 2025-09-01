"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const [contenidos, setContenidos] = useState([]);   // 🔹 todos los datos de la API
  const [tendencias, setTendencias] = useState([]);   // 🔹 solo top 10
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/contenido");
        const data = await res.json();

        const contenidosAPI = Array.isArray(data.data) ? data.data : [];

        // 🔹 Guardar todos los contenidos
        setContenidos(contenidosAPI);

        // 🔹 Sacar solo los aprobados y ordenar por rating (top 10 tendencias)
        const aprobados = contenidosAPI
          .filter((item) => item.estado === "aprobado")
          .sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0))
          .slice(0, 10);

        setTendencias(aprobados);
      } catch (error) {
        console.error("Error cargando contenidos:", error);
      }
    };
    fetchData();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 🔹 Si hay búsqueda → filtrar sobre todos los contenidos
  const resultados = searchTerm
    ? contenidos.filter((item) =>
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tendencias; // si no hay búsqueda → mostrar top 10

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Banner */}
      <section className="relative h-[500px] flex items-center justify-center">
        <Image
          src="/fondo-inicio.webp"
          alt="Banner"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenido a BrisaacFlix
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Millones de películas, series y contenido por descubrir. ¡Explora ya!
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Buscar una película, serie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-l-md text-white w-64 bg-gray-700 focus:outline-none"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Tendencias o Resultados */}
      <section className="px-8 py-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {searchTerm ? "🔎 Resultados" : "🔥 Tendencias"}
          </h2>
        </div>

        {/* Botones de flechas solo si es tendencias */}
        {!searchTerm && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-black/80 z-10"
            >
              ◀
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-black/80 z-10"
            >
              ▶
            </button>
          </>
        )}

        {/* Contenedor scroll */}
        <div
          ref={scrollRef}
          className={`flex gap-4 ${searchTerm ? "flex-wrap justify-center" : "overflow-x-auto scrollbar-hide scroll-smooth"}`}
        >
          {resultados.length === 0 ? (
            <p>No hay contenidos disponibles</p>
          ) : (
            resultados.map((item) => (
              <Link
                key={item._id}
                href={`/contenido/${item._id}`}
                className="min-w-[180px] bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform block"
              >
                <div className="relative w-full h-[270px]">
                  <Image
                    src={item.poster}
                    alt={item.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-semibold truncate">
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-gray-400">{item.anio}</p>
                  <p className="text-xs text-yellow-400 mt-1">
                    ⭐ {item.ratingAvg ?? "N/A"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
