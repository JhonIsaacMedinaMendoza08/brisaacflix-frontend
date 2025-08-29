"use client";
import { useState, useEffect } from "react";
import Image from "next/image";


const API_KEY = "2383c08236b68481577236cdd05f796f";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzgzYzA4MjM2YjY4NDgxNTc3MjM2Y2RkMDVmNzk2ZiIsIm5iZiI6MTc1NjIwNzEzOS43NjgsInN1YiI6IjY4YWQ5ODIzY2JmNzM4YTZhOTFlNThiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sHVzAleMF_N1iZJ-4rFzeQb-8DVg5K0ydHidU9cfsUI";
import Image from "next/image";


export default function NuevoContenido() {
  const [tipo, setTipo] = useState("pelicula");
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generosPeliculas, setGenerosPeliculas] = useState([]);
  const [generosSeries, setGenerosSeries] = useState([]);

  // 🔹 Cargar géneros desde TMDB una sola vez

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const [pelisRes, seriesRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/genre/movie/list?language=es-ES`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
          }),
          fetch(`https://api.themoviedb.org/3/genre/tv/list?language=es-ES`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
          }),
        ]);
        const pelisData = await pelisRes.json();
        const seriesData = await seriesRes.json();
        setGenerosPeliculas(pelisData.genres || []);
        setGenerosSeries(seriesData.genres || []);
      } catch (error) {
        console.error("Error cargando géneros:", error);
      }
    };
    fetchGeneros();
  }, []);

  // 🔹 Buscar en TMDB

  const buscarEnTMDB = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const endpoint =
        tipo === "pelicula"
          ? `https://api.themoviedb.org/3/search/movie?query=${query}&language=es-ES`
          : `https://api.themoviedb.org/3/search/tv?query=${query}&language=es-ES`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = await res.json();
      setResultados(data.results || []);
    } catch (error) {
      console.error("Error buscando en TMDB:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Guardar en backend

  const guardarContenido = async (contenido) => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    if (!token) {
      alert("Debes iniciar sesión para crear contenido.");
      return;
    }

    const generosDisponibles = tipo === "pelicula" ? generosPeliculas : generosSeries;
    const generosMapeados = (contenido.genre_ids || []).map((id) => {
      const g = generosDisponibles.find((gg) => gg.id === id);
      return g ? { id: g.id, name: g.name } : { id, name: "Desconocido" };
    });

    const body = {
      tmdbId: contenido.id,
      tipo,
      titulo: tipo === "pelicula" ? contenido.title : contenido.name,
      sinopsis: contenido.overview || "Sin sinopsis disponible en TMDB.",
      anio: (contenido.release_date || contenido.first_air_date || "").split("-")[0],
      poster: contenido.poster_path
        ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${contenido.poster_path}`
        : "",
      generos: generosMapeados,
      estado: "pendiente",
      usuarioId: usuario.id,
    };

    try {
      const res = await fetch("http://localhost:4000/api/v1/contenido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Error backend:", data);
        alert("Error al crear el contenido.");
        return;
      }

      alert("✅ Contenido solicitado con éxito. Pendiente de aprobación.");
      setPreview(null);
      setResultados([]);
      setQuery("");
    } catch (error) {
      console.error("❌ Error frontend:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
        🎬 Agregar Nuevo Contenido
      </h1>

      {/* Vista previa */}
      {preview ? (
        <div className="max-w-5xl mx-auto bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6">
          <Image
            src={
              preview.poster_path
                ? `https://image.tmdb.org/t/p/w400${preview.poster_path}`
                : "/no-image.jpg"
            }
            alt={preview.title || preview.name}
            width={300} 
            height={450}  
            onError={(e) => {
              e.currentTarget.src = "/no-image.jpg";
            }}
            className="rounded-lg shadow-lg w-full md:w-1/3 object-cover"
          />

          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold">
              {preview.title || preview.name}{" "}
              <span className="text-gray-400 text-lg">
                ({(preview.release_date || preview.first_air_date || "").split("-")[0]})
              </span>
            </h2>

            {/* Géneros */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {(preview.genre_ids || []).map((id) => {
                const g =
                  (tipo === "pelicula" ? generosPeliculas : generosSeries).find(
                    (gg) => gg.id === id
                  );
                return (
                  <span
                    key={id}
                    className="px-3 py-1 bg-blue-700/80 text-sm rounded-full shadow-sm"
                  >
                    {g ? g.name : "Desconocido"}
                  </span>
                );
              })}
            </div>

            {/* Sinopsis */}
            <div className="mt-4 flex-1">
              <h3 className="font-semibold text-lg mb-2">📖 Sinopsis</h3>
              <p className="text-gray-300 leading-relaxed">
                {preview.overview || "Sin sinopsis disponible en TMDB."}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setPreview(null)}
                className="px-5 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition shadow-md"
              >
                ⬅ Volver
              </button>
              <button
                onClick={() => guardarContenido(preview)}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-xl transition shadow-md font-semibold"
              >
                ✅ Solicitar contenido
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Selección tipo */}
          <div className="mb-6 flex justify-center gap-6">
            <button
              onClick={() => setTipo("pelicula")}
              className={`px-6 py-2 rounded-xl font-semibold shadow-md transition ${tipo === "pelicula" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              🎥 Película
            </button>
            <button
              onClick={() => setTipo("serie")}
              className={`px-6 py-2 rounded-xl font-semibold shadow-md transition ${tipo === "serie" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              📺 Serie
            </button>
          </div>

          {/* Buscador */}
          <div className="flex gap-2 mb-8 max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`🔎 Buscar ${tipo}...`}
              className="px-4 py-2 bg-gray-800/90 rounded-xl w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={buscarEnTMDB}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl transition shadow-md font-semibold"
            >
              Buscar
            </button>
          </div>

          {/* Resultados */}
          {loading && <p className="text-center text-gray-400">Buscando...</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {resultados.map((r) => (
              <div
                key={r.id}
                className="bg-gray-800/80 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform"
              >
                <Image
                  src={
                    r.poster_path
                      ? `https://image.tmdb.org/t/p/w300${r.poster_path}`
                      : "/no-image.jpg"
                  }
                  alt={r.title || r.name}
                  width={400}   
                  height={600}  
                  onError={(e) => {
                    e.currentTarget.src = "/no-image.jpg";
                  }}
                  className="w-full h-72 object-cover"
                />
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">
                    {r.title || r.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {(r.release_date || r.first_air_date || "").split("-")[0]}
                  </p>
                  <button
                    onClick={() => setPreview(r)}
                    className="mt-3 w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition shadow"
                  >
                    👀 Previsualizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
