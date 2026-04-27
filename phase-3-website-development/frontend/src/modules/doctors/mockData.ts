import type { Doctor } from "./types";

export const doctorsMock: Doctor[] = [
  {
    id: 1,
    name: "Dr. Noor Al-Hassan",
    specialty: "Cardiology",
    city: "Damascus",
    rating: 4.7,
    phone: "0933000001",
    availableToday: true
  },
  {
    id: 2,
    name: "Dr. Sara Khoury",
    specialty: "Dermatology",
    city: "Homs",
    rating: 4.4,
    phone: "0933000002",
    availableToday: false
  },
  {
    id: 3,
    name: "Dr. Bilal Najjar",
    specialty: "Pediatrics",
    city: "Aleppo",
    rating: 4.9,
    phone: "0933000003",
    availableToday: true
  }
];
