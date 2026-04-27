import type { Doctor } from "../doctors/types";

export type AvailabilitySlot = {
  weekday: string;
  startTime: string;
  endTime: string;
};

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type DashboardAppointment = {
  id: number;
  patientName: string;
  doctorId: number;
  startAt: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type DoctorDashboardData = {
  doctor: Doctor;
  availability: AvailabilitySlot[];
  appointments: DashboardAppointment[];
};
