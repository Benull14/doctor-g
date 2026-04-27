export const API_BASE_URL = "http://localhost:4000/api";

export function setAuthToken(token: string | null) {
  if (!token) {
    localStorage.removeItem("auth_token");
    return;
  }
  localStorage.setItem("auth_token", token);
}

export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...init
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
