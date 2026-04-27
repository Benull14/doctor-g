import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, Star, Phone, Stethoscope, CalendarPlus, Send, Clock } from "lucide-react";
import { fetchDoctors } from "../modules/doctors/api";
import type { Doctor } from "../modules/doctors/types";
import { createAppointment } from "../modules/appointments/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function PatientBookingPage() {
  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDoctor || !dateTime) return;
    setBookingMessage("");
    setBookingError("");
    setSubmitting(true);
    try {
      await createAppointment(selectedDoctor.id, new Date(dateTime).toISOString(), notes);
      setBookingMessage("تم إرسال طلب الموعد بنجاح");
      setNotes("");
      setDateTime("");
    } catch (err) {
      setBookingError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">حجز موعد</h1>
        <p className="section-subtitle">اختر طبيبك وحدد الوقت المناسب</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor list */}
        <div className="lg:col-span-2">
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

          {loading ? (
            <LoadingSpinner text="جار تحميل الأطباء..." />
          ) : doctors.length === 0 ? (
            <EmptyState icon={Stethoscope} title="لا يوجد أطباء" description="حاول تعديل معايير البحث" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doctor) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                return (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`card p-4 text-right transition-all duration-200 cursor-pointer border-none ${
                      isSelected
                        ? "ring-2 ring-primary-500 border-primary-300 shadow-md"
                        : "hover:shadow-md hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary-600" : "bg-primary-100"}`}>
                        <Stethoscope className={`w-5 h-5 ${isSelected ? "text-white" : "text-primary-600"}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm m-0">{doctor.name}</h3>
                        <p className="text-xs text-neutral-500 m-0">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doctor.city}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning-500" /> {Number.isFinite(doctor.rating) ? doctor.rating.toFixed(1) : "-"}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> <span dir="ltr">{doctor.phone}</span></span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking form */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <CalendarPlus className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900 m-0">تفاصيل الحجز</h2>
                <p className="text-xs text-neutral-500 m-0">املأ البيانات لإرسال الموعد</p>
              </div>
            </div>

            {selectedDoctor ? (
              <div className="mb-5 p-3 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-semibold text-primary-800 m-0">{selectedDoctor.name}</p>
                <p className="text-xs text-primary-600 m-0">{selectedDoctor.specialty} - {selectedDoctor.city}</p>
              </div>
            ) : (
              <div className="mb-5 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-center">
                <p className="text-sm text-neutral-500 m-0">اختر طبيبا من القائمة</p>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="input-label flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> موعد الحجز
                </label>
                <input type="datetime-local" className="input-field" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
              </div>
              <div>
                <label className="input-label">ملاحظات (اختياري)</label>
                <textarea className="input-field min-h-[80px] resize-none" placeholder="أضف أي ملاحظات للطبيب..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              {bookingMessage && (
                <div className="bg-accent-50 border border-accent-200 text-accent-700 text-sm rounded-lg px-4 py-3">{bookingMessage}</div>
              )}
              {bookingError && (
                <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg px-4 py-3">{bookingError}</div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={!selectedDoctor || !dateTime || submitting}>
                {submitting ? (
                  <span className="animate-pulse-soft">جار الإرسال...</span>
                ) : (
                  <><Send className="w-4 h-4" /> إرسال طلب الحجز</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
