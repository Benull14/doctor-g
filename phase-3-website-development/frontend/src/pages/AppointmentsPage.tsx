import { useEffect, useState } from "react";
import { CalendarDays, User, Stethoscope } from "lucide-react";
import { fetchMyAppointments, type AppointmentItem } from "../modules/appointments/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAppointments()
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const title = user?.role === "admin" ? "كل المواعيد" : "مواعيدي";

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">{title}</h1>
          <p className="section-subtitle mb-0">
            {user?.role === "admin" ? "عرض وإدارة جميع المواعيد" : "تتبع مواعيدك الطبية"}
          </p>
        </div>
        <span className="badge bg-primary-100 text-primary-700">{appointments.length} موعد</span>
      </div>

      {loading ? (
        <LoadingSpinner text="جار تحميل المواعيد..." />
      ) : appointments.length === 0 ? (
        <EmptyState icon={CalendarDays} title="لا توجد مواعيد" description="لم يتم العثور على أي مواعيد حتى الآن" />
      ) : (
        <div className="space-y-3">
          {appointments.map((apt, i) => (
            <div key={apt.id} className={`card p-5 animate-fade-in stagger-${Math.min((i % 4) + 1, 4)}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-neutral-400">#{apt.id}</span>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" /> {apt.patientName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-neutral-400" /> {apt.doctorName}
                      </span>
                    </div>
                    {apt.notes && <p className="text-xs text-neutral-500 mt-1 m-0">{apt.notes}</p>}
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="text-sm font-semibold text-neutral-800 m-0">
                    {new Date(apt.startAt).toLocaleDateString("ar-SY")}
                  </p>
                  <p className="text-xs text-neutral-500 m-0">
                    {new Date(apt.startAt).toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
