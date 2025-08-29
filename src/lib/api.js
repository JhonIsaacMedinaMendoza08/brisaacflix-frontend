// /lib/api.js
const API_URL = "http://localhost:4000/api/v1";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, config);

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "Error en la petición");
  }

  return data;
}
