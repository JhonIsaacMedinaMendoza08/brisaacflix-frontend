"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [contenidos, setContenidos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/contenido");
        const data = await res.json();

        // Filtrar solo aprobados
        const aprobados = Array.isArray(data)
          ? data.filter((item) => item.estado === "aprobado")
          : [];

        setContenidos(aprobados);
      } catch (error) {
        console.error("Error cargando contenidos:", error);
      }
    };
    fetchData();
  }, []);

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
          <div className="flex justify-center " >
            <input
              type="text"
              placeholder="Buscar una película, serie..."
              className="px-4 py-2 rounded-l-md text-white w-64 bg-gray-700 focus:outline-none"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Tendencias */}
      <section className="px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Tendencias</h2>
          <div className="flex gap-2">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm cursor-pointer">
              Hoy
            </span>
            <span className="bg-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer">
              Esta semana
            </span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {contenidos.length === 0 ? (
            <p>No hay contenidos disponibles</p>
          ) : (
            contenidos.map((item) => (
              <div
                key={item.tmdbId}
                className="min-w-[180px] bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
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
                  <p className="text-xs text-green-400 capitalize mt-1">
                    {item.estado}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}