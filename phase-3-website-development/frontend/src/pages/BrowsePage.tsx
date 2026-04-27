import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, Star, Phone, Clock, CircleCheck as CheckCircle, ArrowLeft, Stethoscope } from "lucide-react";
import { fetchDoctors, fetchDoctorAvailability, type AvailabilitySlot } from "../modules/doctors/api";
import type { Doctor } from "../modules/doctors/types";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function BrowsePage() {
  const { user } = useAuth();
  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

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

  async function showAvailability(doctor: Doctor) {
    setSelectedDoctor(doctor);
    setLoadingSlots(true);
    try {
      const data = await fetchDoctorAvailability(doctor.id);
      setSlots(data);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-bl from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="page-container py-12 sm:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">ابحث عن طبيبك المناسب</h1>
            <p className="text-primary-200 text-lg mb-8">تصفح قائمة الأطباء واحجز موعدك بسهولة وسرعة</p>
            {!user && (
              <div className="flex gap-3 flex-wrap">
                <Link to="/login" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-md btn-lg no-underline">
                  تسجيل الدخول
                </Link>
                <Link to="/register/patient" className="btn-secondary border-white/30 text-white bg-white/10 hover:bg-white/20 btn-lg no-underline">
                  إنشاء حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="page-container -mt-6">
        {/* Search bar */}
        <div className="card p-6 mb-8 shadow-lg">
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

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">الأطباء</h2>
          <span className="badge bg-neutral-100 text-neutral-600">{doctors.length} طبيب</span>
        </div>

        {/* Doctor grid */}
        {loading ? (
          <LoadingSpinner text="جار تحميل قائمة الأطباء..." />
        ) : doctors.length === 0 ? (
          <EmptyState icon={Stethoscope} title="لا يوجد أطباء" description="لم يتم العثور على أطباء مطابقين لبحثك" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doctor, i) => (
              <div key={doctor.id} className={`card-hover p-5 animate-fade-in stagger-${Math.min((i % 4) + 1, 4)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 m-0">{doctor.name}</h3>
                      <p className="text-sm text-neutral-500 m-0">{doctor.specialty}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs ${doctor.availableToday ? "bg-accent-100 text-accent-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {doctor.availableToday ? "متاح" : "غير متاح"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" /> {doctor.city}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" /> <span dir="ltr">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Star className="w-3.5 h-3.5 text-warning-500 flex-shrink-0" />
                    {Number.isFinite(doctor.rating) ? `${doctor.rating.toFixed(1)} / 5` : "بدون تقييم"}
                  </div>
                </div>

                <button onClick={() => showAvailability(doctor)} className="btn-secondary w-full text-sm">
                  <Clock className="w-4 h-4" /> عرض أوقات العمل
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Availability modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedDoctor(null)}>
            <div className="card p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900 m-0">أوقات عمل {selectedDoctor.name}</h3>
                <button onClick={() => setSelectedDoctor(null)} className="btn-ghost btn-sm">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {loadingSlots ? (
                <LoadingSpinner text="جار تحميل الأوقات..." />
              ) : slots.length === 0 ? (
                <p className="text-center text-neutral-500 py-8">لا توجد أوقات متاحة حاليا</p>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-accent-500" />
                        <span className="font-medium text-sm">{slot.weekday}</span>
                      </div>
                      <span className="text-sm text-neutral-600" dir="ltr">{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              )}

              {!user && (
                <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                  <p className="text-sm text-neutral-500 mb-3">للحجز يجب تسجيل الدخول أولا</p>
                  <Link to="/login" className="btn-primary btn-sm no-underline">تسجيل الدخول</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
