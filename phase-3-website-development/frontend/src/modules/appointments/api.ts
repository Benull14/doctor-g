import { apiFetch } from "../../shared/api";

export type AppointmentItem = {
  id: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  startAt: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  createdAt: string;
};

export function fetchMyAppointments() {
  return apiFetch<AppointmentItem[]>("/appointments");
}

export function createAppointment(doctorId: number, startAt: string, notes: string) {
  return apiFetch<AppointmentItem>("/appointments", {
    method: "POST",
    body: JSON.stringify({ doctorId, startAt, notes })
  });
}
