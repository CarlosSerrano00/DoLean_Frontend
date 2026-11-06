import { API_BASE_URL } from "./config";

export async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("Configura VITE_API_BASE_URL antes de realizar solicitudes al backend.");
  }

  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const url = new URL(path.replace(/^\//, ""), baseUrl);
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("No fue posible conectar con el servicio.", { cause: error });
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" && payload?.message
      ? payload.message
      : `La solicitud falló con el estado ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}
