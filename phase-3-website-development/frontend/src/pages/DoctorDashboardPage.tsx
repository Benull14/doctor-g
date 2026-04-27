import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, CalendarDays, User, CircleAlert as AlertCircle } from "lucide-react";
import { fetchDoctorDashboard, saveDoctorAvailability, updateAppointmentStatus } from "../modules/doctor-dashboard/api";
import type { AppointmentStatus, AvailabilitySlot, DashboardAppointment, DoctorDashboardData } from "../modules/doctor-dashboard/types";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const statusLabels: Record<AppointmentStatus, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", completed: "مكتمل", cancelled: "ملغي", no_show: "لم يحضر",
};
const allowedStatuses: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const doctorId = user?.doctorId ?? null;
  const [dashboard, setDashboard] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newSlot, setNewSlot] = useState<AvailabilitySlot>({ weekday: "الاثنين", startTime: "09:00", endTime: "14:00" });

  useEffect(() => {
    if (!doctorId) { setLoading(false); return; }
    setLoading(true);
    fetchDoctorDashboard(doctorId)
      .then(setDashboard)
      .catch(() => setMessage("فشل تحميل البيانات"))
      .finally(() => setLoading(false));
  }, [doctorId]);

  function showMsg(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  async function addSlot() {
    if (!dashboard) return;
    const availability = [...dashboard.availability, newSlot];
    await saveDoctorAvailability(dashboard.doctor.id, availability);
    setDashboard({ ...dashboard, availability });
    showMsg("تم إضافة وقت العمل");
  }

  async function removeSlot(index: number) {
    if (!dashboard) return;
    const availability = dashboard.availability.filter((_, i) => i !== index);
    await saveDoctorAvailability(dashboard.doctor.id, availability);
    setDashboard({ ...dashboard, availability });
    showMsg("تم حذف وقت العمل");
  }

  async function changeStatus(apt: DashboardAppointment, status: AppointmentStatus) {
    const updated = await updateAppointmentStatus(apt.id, status);
    if (!dashboard) return;
    setDashboard({ ...dashboard, appointments: dashboard.appointments.map((a) => (a.id === updated.id ? updated : a)) });
    showMsg(`تم تحديث الموعد #${updated.id} إلى ${statusLabels[updated.status]}`);
  }

  if (loading) return <div className="page-container"><LoadingSpinner text="جار تحميل لوحة التحكم..." /></div>;
  if (!dashboard) return <div className="page-container"><EmptyState icon={AlertCircle} title="لا توجد بيانات" description="لم يتم العثور على بيانات لوحة الطبيب" /></div>;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="section-title">لوحة التحكم</h1>
          <p className="section-subtitle mb-0">مرحبا، د. {dashboard.doctor.name}</p>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-primary-600 m-0">{dashboard.appointments.length}</p>
            <p className="text-xs text-neutral-500 m-0">إجمالي المواعيد</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-accent-600 m-0">{dashboard.availability.length}</p>
            <p className="text-xs text-neutral-500 m-0">أوقات العمل</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="bg-accent-50 border border-accent-200 text-accent-700 text-sm rounded-lg px-4 py-3 mb-6 animate-fade-in">{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Availability */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-600" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 m-0">أوقات العمل</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-neutral-50 rounded-xl">
            <select className="select-field flex-1 min-w-[120px]" value={newSlot.weekday} onChange={(e) => setNewSlot({ ...newSlot, weekday: e.target.value })}>
              {weekdays.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" className="input-field w-28" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} />
            <input type="time" className="input-field w-28" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} />
            <button type="button" onClick={addSlot} className="btn-accent btn-sm"><Plus className="w-4 h-4" /> إضافة</button>
          </div>

          {dashboard.availability.length === 0 ? (
            <p className="text-center text-sm text-neutral-500 py-6">لم تضف أي أوقات عمل بعد</p>
          ) : (
            <div className="space-y-2">
              {dashboard.availability.map((slot, i) => (
                <div key={`${slot.weekday}-${slot.startTime}-${i}`} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg group hover:border-neutral-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-neutral-800 w-20">{slot.weekday}</span>
                    <span className="text-sm text-neutral-600" dir="ltr">{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <button type="button" onClick={() => removeSlot(i)} className="btn-ghost btn-sm text-error-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 m-0">المواعيد</h2>
          </div>

          {dashboard.appointments.length === 0 ? (
            <EmptyState icon={CalendarDays} title="لا توجد مواعيد" description="لم تستقبل أي مواعيد بعد" />
          ) : (
            <div className="space-y-3">
              {dashboard.appointments.map((apt) => (
                <div key={apt.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-400" />
                      <span className="font-semibold text-sm text-neutral-800">{apt.patientName}</span>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                  <p className="text-xs text-neutral-500 mb-3 m-0">
                    {new Date(apt.startAt).toLocaleString("ar-SY")}
                    {apt.notes && ` - ${apt.notes}`}
                  </p>
                  <select className="select-field text-xs py-1.5" value={apt.status} onChange={(e) => changeStatus(apt, e.target.value as AppointmentStatus)}>
                    {allowedStatuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
