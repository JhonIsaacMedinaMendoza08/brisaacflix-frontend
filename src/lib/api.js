export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json", // ⚡ necesario para enviar body JSON
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const res = await fetch(`http://localhost:4000/api/v1${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text(); // leer detalle del backend
    throw new Error(errorText || "Error en la petición");
  }

  return res.json();
}