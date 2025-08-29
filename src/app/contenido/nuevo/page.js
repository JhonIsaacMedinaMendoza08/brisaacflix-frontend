"use client";
import { useState, useEffect } from "react";

const API_KEY = "2383c08236b68481577236cdd05f796f";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzgzYzA4MjM2YjY4NDgxNTc3MjM2Y2RkMDVmNzk2ZiIsIm5iZiI6MTc1NjIwNzEzOS43NjgsInN1YiI6IjY4YWQ5ODIzY2JmNzM4YTZhOTFlNThiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sHVzAleMF_N1iZJ-4rFzeQb-8DVg5K0ydHidU9cfsUI";

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
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Agregar nuevo contenido</h1>

      {/* Si estamos en vista previa */}
      {preview ? (
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={
              preview.poster_path
                ? `https://image.tmdb.org/t/p/w400${preview.poster_path}`
                : "/no-image.png"
            }
            alt={preview.title || preview.name}
            className="rounded-lg w-full md:w-1/3"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {preview.title || preview.name}{" "}
              <span className="text-gray-400">
                ({(preview.release_date || preview.first_air_date || "").split("-")[0]})
              </span>
            </h2>

            {/* Generos */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {(preview.genre_ids || []).map((id) => {
                const g =
                  (tipo === "pelicula" ? generosPeliculas : generosSeries).find(
                    (gg) => gg.id === id
                  );
                return (
                  <span
                    key={id}
                    className="px-3 py-1 bg-blue-800 text-sm rounded-full"
                  >
                    {g ? g.name : "Desconocido"}
                  </span>
                );
              })}
            </div>

            {/* Sinopsis */}
            <div className="mt-4">
              <h3 className="font-semibold">Sinopsis</h3>
              <p className="text-gray-300">
                {preview.overview || "Sin sinopsis disponible en TMDB."}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                ⬅ Volver
              </button>
              <button
                onClick={() => guardarContenido(preview)}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Solicitar contenido
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Selección tipo */}
          <div className="mb-4 flex gap-4">
            <button
              onClick={() => setTipo("pelicula")}
              className={`px-4 py-2 rounded ${tipo === "pelicula" ? "bg-blue-600" : "bg-gray-700"}`}
            >
              Película
            </button>
            <button
              onClick={() => setTipo("serie")}
              className={`px-4 py-2 rounded ${tipo === "serie" ? "bg-blue-600" : "bg-gray-700"}`}
            >
              Serie
            </button>
          </div>

          {/* Buscador */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Buscar ${tipo}...`}
              className="px-4 py-2 bg-gray-800 rounded w-full"
            />
            <button
              onClick={buscarEnTMDB}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Buscar
            </button>
          </div>

          {/* Resultados */}
          {loading && <p>Buscando...</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {resultados.map((r) => (
              <div key={r.id} className="p-2 rounded-lg bg-gray-800">
                <img
                  src={
                    r.poster_path
                      ? `https://image.tmdb.org/t/p/w300${r.poster_path}`
                      : "/no-image.png"
                  }
                  alt={r.title || r.name}
                  className="rounded"
                />
                <p className="mt-2 font-semibold text-sm">
                  {r.title || r.name}{" "}
                  <span className="text-gray-400">
                    ({(r.release_date || r.first_air_date || "").split("-")[0]})
                  </span>
                </p>
                <button
                  onClick={() => setPreview(r)}
                  className="mt-2 w-full px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Previsualizar
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
