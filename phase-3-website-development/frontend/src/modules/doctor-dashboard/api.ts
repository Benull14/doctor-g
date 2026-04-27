import { apiFetch } from "../../shared/api";
import type {
  AppointmentStatus,
  AvailabilitySlot,
  DashboardAppointment,
  DoctorDashboardData
} from "./types";

export function fetchDoctorDashboard(doctorId: number) {
  return apiFetch<DoctorDashboardData>(`/doctor-dashboard/${doctorId}`);
}

export function saveDoctorAvailability(doctorId: number, availability: AvailabilitySlot[]) {
  return apiFetch<{ doctorId: number; availability: AvailabilitySlot[] }>(
    `/doctor-dashboard/${doctorId}/availability`,
    {
      method: "PUT",
      body: JSON.stringify({ availability })
    }
  );
}

export function updateAppointmentStatus(appointmentId: number, status: AppointmentStatus) {
  return apiFetch<DashboardAppointment>(`/appointments/${appointmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
