import { apiFetch } from "../../shared/api";

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "patient" | "doctor" | "admin";
    doctorId: number | null;
  };
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "patient" | "doctor";
  specialty?: string;
  city?: string;
};

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function getCurrentUser() {
  return apiFetch<LoginResponse["user"]>("/auth/me");
}

export function register(payload: RegisterPayload) {
  return apiFetch<{ message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function verifyEmail(token: string) {
  return apiFetch<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}
