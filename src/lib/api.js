// src/lib/api.js
export async function apiRequest(endpoint, method = "GET", body) {
    const res = await fetch(`http://localhost:4000/api/v1/usuarios${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en la petición");
    }

    return res.json();
}
