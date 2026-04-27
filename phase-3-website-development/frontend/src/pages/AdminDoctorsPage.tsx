import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, Star, Phone, Stethoscope, Users, LayoutDashboard, Clock, Plus, Trash2, CalendarDays, User } from "lucide-react";
import { fetchDoctors } from "../modules/doctors/api";
import type { Doctor } from "../modules/doctors/types";
import { fetchDoctorDashboard, saveDoctorAvailability, updateAppointmentStatus } from "../modules/doctor-dashboard/api";
import type { AppointmentStatus, AvailabilitySlot, DashboardAppointment, DoctorDashboardData } from "../modules/doctor-dashboard/types";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const allowedStatuses: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled", "no_show"];
const statusLabels: Record<AppointmentStatus, string> = {
  pending: "قيد الانتظار", confirmed: "مؤكد", completed: "مكتمل", cancelled: "ملغي", no_show: "لم يحضر",
};

export default function AdminDoctorsPage() {
  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  // Inline dashboard state
  const [dashboard, setDashboard] = useState<DoctorDashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newSlot, setNewSlot] = useState<AvailabilitySlot>({ weekday: "الاثنين", startTime: "09:00", endTime: "14:00" });

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchDoctors({ name: nameFilter, specialty: specialtyFilter, city: cityFilter })
        .then(setDoctors)
        .catch(() => setDoctors([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [nameFilter, specialtyFilter, cityFilter]);

  useEffect(() => {
    if (!selectedDoctorId) { setDashboard(null); return; }
    setDashLoading(true);
    fetchDoctorDashboard(selectedDoctorId)
      .then(setDashboard)
      .catch(() => setMessage("فشل تحميل البيانات"))
      .finally(() => setDashLoading(false));
  }, [selectedDoctorId]);

  function showMsg(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  async function addSlot() {
    if (!dashboard) return;
    const availability = [...dashboard.availability, newSlot];
    await saveDoctorAvailability(dashboard.doctor.id, availability);
    setDashboard({ ...dashboard, availability });
    showMsg("تم الحفظ");
  }

  async function removeSlot(index: number) {
    if (!dashboard) return;
    const availability = dashboard.availability.filter((_, i) => i !== index);
    await saveDoctorAvailability(dashboard.doctor.id, availability);
    setDashboard({ ...dashboard, availability });
  }

  async function changeStatus(apt: DashboardAppointment, status: AppointmentStatus) {
    const updated = await updateAppointmentStatus(apt.id, status);
    if (!dashboard) return;
    setDashboard({ ...dashboard, appointments: dashboard.appointments.map((a) => (a.id === updated.id ? updated : a)) });
    showMsg(`تم تحديث الموعد #${updated.id}`);
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Users className="w-7 h-7 text-primary-600" /> إدارة الأطباء
          </h1>
          <p className="section-subtitle mb-0">اختر طبيبا لإدارة التوفر والمواعيد</p>
        </div>
        <span className="badge bg-primary-100 text-primary-700">{doctors.length} طبيب</span>
      </div>

      {/* Search */}
      <div className="card p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input className="input-field pr-10" placeholder="اسم الطبيب..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
          </div>
          <div className="relative">
            <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input className="input-field pr-10" placeholder="الاختصاص..." value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)} />
          </div>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input className="input-field pr-10" placeholder="المدينة..." value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Doctor grid */}
      {loading ? (
        <LoadingSpinner text="جار تحميل الأطباء..." />
      ) : doctors.length === 0 ? (
        <EmptyState icon={Stethoscope} title="لا يوجد أطباء" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {doctors.map((doctor) => {
            const isSelected = selectedDoctorId === doctor.id;
            return (
              <button
                key={doctor.id}
                type="button"
                onClick={() => setSelectedDoctorId(doctor.id)}
                className={`card p-4 text-right transition-all duration-200 cursor-pointer border-none ${
                  isSelected ? "ring-2 ring-primary-500 shadow-md" : "hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary-600" : "bg-primary-100"}`}>
                    <Stethoscope className={`w-5 h-5 ${isSelected ? "text-white" : "text-primary-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 m-0">{doctor.name}</h3>
                    <p className="text-xs text-neutral-500 m-0">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doctor.city}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning-500" /> {Number.isFinite(doctor.rating) ? doctor.rating.toFixed(1) : "-"}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> <span dir="ltr">{doctor.phone}</span></span>
                </div>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-primary-600">
                    <LayoutDashboard className="w-3 h-3" /> تم الاختيار
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected doctor dashboard */}
      {selectedDoctorId && (
        <div className="card p-6 animate-fade-in">
          {dashLoading ? (
            <LoadingSpinner text="جار تحميل لوحة الطبيب..." />
          ) : !dashboard ? (
            <p className="text-center text-neutral-500 py-8">لا توجد بيانات</p>
          ) : (
            <>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">لوحة الطبيب - {dashboard.doctor.name}</h2>
              {message && <div className="bg-accent-50 border border-accent-200 text-accent-700 text-sm rounded-lg px-4 py-3 mb-4">{message}</div>}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Availability */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-accent-600" />
                    <h3 className="font-bold text-neutral-800 m-0">أوقات العمل</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4 p-3 bg-neutral-50 rounded-lg">
                    <select className="select-field flex-1 min-w-[100px] text-sm py-1.5" value={newSlot.weekday} onChange={(e) => setNewSlot({ ...newSlot, weekday: e.target.value })}>
                      {weekdays.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input type="time" className="input-field w-24 text-sm py-1.5" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} />
                    <input type="time" className="input-field w-24 text-sm py-1.5" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} />
                    <button type="button" onClick={addSlot} className="btn-accent btn-sm"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-2">
                    {dashboard.availability.map((slot, i) => (
                      <div key={`${slot.weekday}-${slot.startTime}-${i}`} className="flex items-center justify-between p-2.5 border border-neutral-200 rounded-lg group hover:border-neutral-300">
                        <span className="text-sm"><strong>{slot.weekday}</strong>: <span dir="ltr">{slot.startTime} - {slot.endTime}</span></span>
                        <button type="button" onClick={() => removeSlot(i)} className="btn-ghost btn-sm text-error-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appointments */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-4 h-4 text-primary-600" />
                    <h3 className="font-bold text-neutral-800 m-0">المواعيد</h3>
                  </div>
                  {dashboard.appointments.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-6">لا توجد مواعيد</p>
                  ) : (
                    <div className="space-y-2">
                      {dashboard.appointments.map((apt) => (
                        <div key={apt.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
                              <User className="w-3.5 h-3.5 text-neutral-400" /> {apt.patientName}
                            </span>
                            <StatusBadge status={apt.status} />
                          </div>
                          <p className="text-xs text-neutral-500 mb-2 m-0">{new Date(apt.startAt).toLocaleString("ar-SY")}</p>
                          <select className="select-field text-xs py-1" value={apt.status} onChange={(e) => changeStatus(apt, e.target.value as AppointmentStatus)}>
                            {allowedStatuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
