import { apiFetch } from "../../shared/api";
import type { Doctor } from "./types";

type DoctorFilters = {
  name: string;
  specialty: string;
  city: string;
};

export function fetchDoctors(filters: DoctorFilters) {
  const query = new URLSearchParams({
    name: filters.name,
    specialty: filters.specialty,
    city: filters.city
  });

  return apiFetch<Doctor[]>(`/doctors?${query.toString()}`);
}

export type AvailabilitySlot = {
  id: number;
  doctorId: number;
  weekday: string;
  startTime: string;
  endTime: string;
};

export function fetchDoctorAvailability(doctorId: number) {
  return apiFetch<AvailabilitySlot[]>(`/doctors/${doctorId}/availability`);
}
