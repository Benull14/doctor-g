import { useEffect, useState } from "react";
import {
  fetchDoctorDashboard,
  saveDoctorAvailability,
  updateAppointmentStatus
} from "../api";
import type {
  AppointmentStatus,
  AvailabilitySlot,
  DashboardAppointment,
  DoctorDashboardData
} from "../types";

const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const allowedStatuses: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show"
];

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
  no_show: "لم يحضر"
};

type DoctorDashboardProps = {
  selectedDoctorId: number | null;
};

export default function DoctorDashboard({ selectedDoctorId }: DoctorDashboardProps) {
  const [dashboard, setDashboard] = useState<DoctorDashboardData | null>(null);
  const [newSlot, setNewSlot] = useState<AvailabilitySlot>({
    weekday: "الاثنين",
    startTime: "09:00",
    endTime: "14:00"
  });
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDoctorId) {
      setDashboard(null);
      return;
    }

    setLoading(true);
    fetchDoctorDashboard(selectedDoctorId)
      .then((data) => setDashboard(data))
      .catch((error) => setStatusMessage(`فشل تحميل لوحة الطبيب: ${String(error)}`))
      .finally(() => setLoading(false));
  }, [selectedDoctorId]);

  async function handleAddSlot() {
    if (!dashboard) return;

    const availability = [...dashboard.availability, newSlot];
    await saveDoctorAvailability(dashboard.doctor.id, availability);
    setDashboard({ ...dashboard, availability });
    setStatusMessage("تم تحديث أوقات التوفر.");
  }

  async function handleRemoveSlot(index: number) {
    if (!dashboard) return;
    const availability = dashboard.availability.filter((_, i) => i !== index);
    await saveDoctorAvailability(dashboard.doctor.id, availability);
    setDashboard({ ...dashboard, availability });
    setStatusMessage("تم تحديث أوقات التوفر.");
  }

  async function handleStatusChange(appointment: DashboardAppointment, status: AppointmentStatus) {
    const updated = await updateAppointmentStatus(appointment.id, status);
    if (!dashboard) return;

    const appointments = dashboard.appointments.map((item) =>
      item.id === updated.id ? updated : item
    );

    setDashboard({ ...dashboard, appointments });
    setStatusMessage(`تم تحديث حالة الموعد رقم ${updated.id} إلى ${statusLabels[updated.status]}.`);
  }

  if (!selectedDoctorId) {
    return (
      <section className="results">
        <h2>لوحة الطبيب</h2>
        <p>اختر طبيبا من القائمة أعلاه لإدارة التوفر وحالات المواعيد.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="results">
        <h2>لوحة الطبيب</h2>
        <p>جار تحميل لوحة الطبيب...</p>
      </section>
    );
  }

  if (!dashboard) {
    return (
      <section className="results">
        <h2>لوحة الطبيب</h2>
        <p>لا توجد بيانات متاحة حاليا.</p>
      </section>
    );
  }

  return (
    <section className="results">
      <h2>لوحة الطبيب - {dashboard.doctor.name}</h2>
      {statusMessage ? <p className="status-message">{statusMessage}</p> : null}

      <div className="dashboard-grid">
        <div className="panel">
          <h3>أوقات التوفر</h3>
          <div className="inline-form">
            <select
              value={newSlot.weekday}
              onChange={(e) => setNewSlot({ ...newSlot, weekday: e.target.value })}
            >
              {weekdays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            />
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            />
            <button onClick={handleAddSlot} type="button">
              إضافة وقت
            </button>
          </div>

          <ul className="slot-list">
            {dashboard.availability.map((slot, index) => (
              <li key={`${slot.weekday}-${slot.startTime}-${slot.endTime}-${index}`}>
                <span>
                  {slot.weekday}: {slot.startTime} - {slot.endTime}
                </span>
                <button onClick={() => handleRemoveSlot(index)} type="button">
                  حذف
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>المواعيد</h3>
          <table>
            <thead>
              <tr>
                <th>رقم</th>
                <th>المريض</th>
                <th>وقت الموعد</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patientName}</td>
                  <td>{new Date(appointment.startAt).toLocaleString("ar-SY")}</td>
                  <td>
                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        handleStatusChange(appointment, e.target.value as AppointmentStatus)
                      }
                    >
                      {allowedStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
