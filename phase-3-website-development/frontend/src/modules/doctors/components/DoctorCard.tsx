import type { Doctor } from "../types";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const ratingValue = Number.isFinite(doctor.rating) ? doctor.rating.toFixed(1) : "غير متوفر";

  return (
    <article className="doctor-card">
      <h3>{doctor.name}</h3>
      <p>
        <strong>الاختصاص:</strong> {doctor.specialty}
      </p>
      <p>
        <strong>المدينة:</strong> {doctor.city}
      </p>
      <p>
        <strong>الهاتف:</strong> {doctor.phone}
      </p>
      <p>
        <strong>التقييم:</strong> {ratingValue} / 5
      </p>
      <p className={doctor.availableToday ? "available" : "unavailable"}>
        {doctor.availableToday ? "متاح اليوم" : "غير متاح اليوم"}
      </p>
    </article>
  );
}
