import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import DoctorCard from "./modules/doctors/components/DoctorCard";
import DoctorSearch from "./modules/doctors/components/DoctorSearch";
import { fetchDoctorAvailability, fetchDoctors, type AvailabilitySlot } from "./modules/doctors/api";
import type { Doctor } from "./modules/doctors/types";
import DoctorDashboard from "./modules/doctor-dashboard/components/DoctorDashboard";
import { getCurrentUser, login, register, verifyEmail } from "./modules/auth/api";
import { createAppointment, fetchMyAppointments, type AppointmentItem } from "./modules/appointments/api";
import { getAuthToken, setAuthToken } from "./shared/api";

type UserRole = "patient" | "doctor" | "admin";
type CurrentUser = {
  id: number;
  name: string;
  role: UserRole;
  doctorId: number | null;
};

function UnauthorizedPage() {
  return (
    <main className="container">
      <section className="results">
        <h2>401 - غير مصرح</h2>
        <p>يجب تسجيل الدخول للوصول إلى هذه الصفحة.</p>
        <Link to="/login">الذهاب إلى تسجيل الدخول</Link>
      </section>
    </main>
  );
}

function ForbiddenPage() {
  return (
    <main className="container">
      <section className="results">
        <h2>403 - ممنوع</h2>
        <p>ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
        <Link to="/">العودة للصفحة الرئيسية</Link>
      </section>
    </main>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("noor@doctor-g.local");
  const [password, setPassword] = useState("Doctor123!");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authMessage, setAuthMessage] = useState("");
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [bookingDoctorId, setBookingDoctorId] = useState<number | null>(null);
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [availabilityDoctorId, setAvailabilityDoctorId] = useState<number | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    if (!getAuthToken()) return;
    getCurrentUser()
      .then((user) => {
        setCurrentUser({
          id: user.id,
          name: user.name,
          role: user.role,
          doctorId: user.doctorId
        });
      })
      .catch(() => {
        setAuthToken(null);
        setCurrentUser(null);
      });
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setAppointments([]);
      return;
    }
    fetchMyAppointments()
      .then((items) => setAppointments(items))
      .catch(() => setAppointments([]));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === "doctor") {
      setSelectedDoctorId(currentUser.doctorId);
    }
    if (currentUser.role === "patient") {
      setSelectedDoctorId(null);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (location.pathname === "/" || location.pathname === "/login") {
      if (currentUser.role === "doctor") navigate("/doctor/dashboard", { replace: true });
      if (currentUser.role === "patient") navigate("/patient/booking", { replace: true });
      if (currentUser.role === "admin") navigate("/admin/doctors", { replace: true });
    }
  }, [currentUser, location.pathname, navigate]);

  useEffect(() => {
    setLoadingDoctors(true);
    fetchDoctors({
      name: nameFilter,
      specialty: specialtyFilter,
      city: cityFilter
    })
      .then((data) => {
        setDoctors(data);
        setErrorMessage("");
      })
      .catch((error) => setErrorMessage(`فشل تحميل قائمة الأطباء: ${String(error)}`))
      .finally(() => setLoadingDoctors(false));
  }, [nameFilter, specialtyFilter, cityFilter]);

  const filteredDoctors = useMemo(() => {
    return doctors;
  }, [doctors]);

  async function handleLoginSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const result = await login(email, password);
      setAuthToken(result.token);
      setCurrentUser({
        id: result.user.id,
        name: result.user.name,
        role: result.user.role,
        doctorId: result.user.doctorId
      });
      setAuthMessage(`تم تسجيل الدخول بنجاح كـ ${result.user.name}.`);
      if (result.user.role === "doctor") navigate("/doctor/dashboard");
      if (result.user.role === "patient") navigate("/patient/booking");
      if (result.user.role === "admin") navigate("/admin/doctors");
    } catch (error) {
      setAuthMessage(`فشل تسجيل الدخول: ${String(error)}`);
    }
  }

  function handleLogout() {
    setAuthToken(null);
    setCurrentUser(null);
    setSelectedDoctorId(null);
    setBookingDoctorId(null);
    setBookingDateTime("");
    setBookingNotes("");
    setAuthMessage("تم تسجيل الخروج.");
    navigate("/login");
  }

  async function handleCreateAppointment(event: React.FormEvent) {
    event.preventDefault();
    if (!bookingDoctorId || !bookingDateTime) {
      setBookingMessage("يرجى اختيار طبيب ووقت الموعد.");
      return;
    }

    try {
      await createAppointment(bookingDoctorId, new Date(bookingDateTime).toISOString(), bookingNotes);
      setBookingMessage("تم إرسال طلب الموعد بنجاح.");
      setBookingNotes("");
      const items = await fetchMyAppointments();
      setAppointments(items);
    } catch (error) {
      setBookingMessage(`تعذر إنشاء الموعد: ${String(error)}`);
    }
  }

  const roleLabel = currentUser
    ? { patient: "مريض", doctor: "طبيب", admin: "مشرف" }[currentUser.role]
    : null;

  async function handleShowAvailability(doctorId: number) {
    setAvailabilityDoctorId(doctorId);
    const slots = await fetchDoctorAvailability(doctorId);
    setAvailabilitySlots(slots);
  }

  async function handleRegister(
    event: React.FormEvent,
    payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      role: "patient" | "doctor";
      specialty?: string;
      city?: string;
    }
  ) {
    event.preventDefault();
    try {
      const result = await register(payload);
      setRegisterMessage(result.message);
      navigate("/login");
    } catch (error) {
      setRegisterMessage(`تعذر إنشاء الحساب: ${String(error)}`);
    }
  }

  function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <main className="container">
        <header>
          <h1>دليل الأطباء ونظام حجز المواعيد</h1>
          <p>المرحلة الثالثة - تطوير الموقع بشكل معياري</p>
        </header>
        <section className="results">
          <div className="inline-form">
            <p>
              مستخدم حالي: <strong>{currentUser?.name}</strong> ({roleLabel})
            </p>
            <nav className="inline-form">
              {currentUser?.role === "patient" ? <Link to="/patient/booking">حجز موعد</Link> : null}
              {currentUser?.role === "doctor" ? <Link to="/doctor/dashboard">لوحة الطبيب</Link> : null}
              {currentUser?.role === "admin" ? <Link to="/admin/doctors">لوحة المشرف</Link> : null}
              <Link to="/appointments">المواعيد</Link>
              <button type="button" onClick={handleLogout}>
                تسجيل الخروج
              </button>
            </nav>
          </div>
          {authMessage ? <p className="status-message">{authMessage}</p> : null}
        </section>
        {children}
      </main>
    );
  }

  function RequireAuth({
    allowedRoles,
    children
  }: {
    allowedRoles: UserRole[];
    children: React.ReactNode;
  }) {
    if (!currentUser) return <Navigate to="/401" replace />;
    if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/403" replace />;
    return <>{children}</>;
  }

  function LoginPage() {
    return (
      <main className="container">
        <header>
          <h1>دليل الأطباء ونظام حجز المواعيد</h1>
          <p>تسجيل الدخول</p>
        </header>
        <section className="results">
          <form className="inline-form" onSubmit={handleLoginSubmit}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              type="password"
            />
            <button type="submit">تسجيل الدخول</button>
          </form>
          <div className="inline-form" style={{ marginTop: 12 }}>
            <Link to="/register/patient">تسجيل مريض</Link>
            <Link to="/register/doctor">تسجيل طبيب</Link>
          </div>
          {authMessage ? <p className="status-message">{authMessage}</p> : null}
          {registerMessage ? <p className="status-message">{registerMessage}</p> : null}
        </section>
      </main>
    );
  }

  function PublicBrowsePage() {
    return (
      <main className="container">
        <header>
          <h1>دليل الأطباء ونظام حجز المواعيد</h1>
          <p>يمكنك البحث عن الأطباء والاطلاع على أوقات العمل بدون تسجيل دخول.</p>
        </header>
        <section className="results">
          <div className="inline-form">
            <Link to="/login">تسجيل الدخول</Link>
            <Link to="/register/patient">تسجيل مريض</Link>
            <Link to="/register/doctor">تسجيل طبيب</Link>
          </div>
        </section>
        <DoctorSearch
          nameFilter={nameFilter}
          specialtyFilter={specialtyFilter}
          cityFilter={cityFilter}
          onNameChange={setNameFilter}
          onSpecialtyChange={setSpecialtyFilter}
          onCityChange={setCityFilter}
        />
        <section className="results">
          <h2>الأطباء ({filteredDoctors.length})</h2>
          <div className="cards-grid">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card-wrap">
                <DoctorCard doctor={doctor} />
                <button type="button" onClick={() => handleShowAvailability(doctor.id)}>
                  عرض أوقات العمل
                </button>
              </div>
            ))}
          </div>
        </section>
        {availabilityDoctorId ? (
          <section className="results">
            <h2>أوقات العمل</h2>
            {availabilitySlots.length === 0 ? <p>لا توجد أوقات متاحة حاليا.</p> : null}
            <ul className="slot-list">
              {availabilitySlots.map((slot) => (
                <li key={slot.id}>
                  <span>
                    {slot.weekday}: {slot.startTime} - {slot.endTime}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              للحجز أو التقييم يجب تسجيل الدخول. إذا لم يكن لديك حساب، قم بالتسجيل وتأكيد البريد
              الإلكتروني.
            </p>
          </section>
        ) : null}
      </main>
    );
  }

  function RegisterPatientPage() {
    const [name, setName] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [phone, setPhone] = useState("");
    return (
      <main className="container">
        <header>
          <h1>تسجيل حساب مريض</h1>
        </header>
        <section className="results">
          <form
            className="inline-form"
            onSubmit={(e) =>
              handleRegister(e, {
                name,
                email: emailValue,
                password: passwordValue,
                phone,
                role: "patient"
              })
            }
          >
            <input placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
            <input
              placeholder="البريد الإلكتروني"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <input placeholder="الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button type="submit">إنشاء حساب</button>
          </form>
          {registerMessage ? <p className="status-message">{registerMessage}</p> : null}
        </section>
      </main>
    );
  }

  function RegisterDoctorPage() {
    const [name, setName] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [phone, setPhone] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [city, setCity] = useState("");
    return (
      <main className="container">
        <header>
          <h1>تسجيل حساب طبيب</h1>
        </header>
        <section className="results">
          <form
            className="inline-form"
            onSubmit={(e) =>
              handleRegister(e, {
                name,
                email: emailValue,
                password: passwordValue,
                phone,
                role: "doctor",
                specialty,
                city
              })
            }
          >
            <input placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
            <input
              placeholder="البريد الإلكتروني"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <input placeholder="الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input
              placeholder="الاختصاص"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
            <input placeholder="المدينة" value={city} onChange={(e) => setCity(e.target.value)} />
            <button type="submit">إنشاء حساب طبيب</button>
          </form>
          {registerMessage ? <p className="status-message">{registerMessage}</p> : null}
        </section>
      </main>
    );
  }

  function VerifyEmailPage() {
    const [message, setMessage] = useState("جار التحقق من البريد...");
    useEffect(() => {
      const token = new URLSearchParams(location.search).get("token");
      if (!token) {
        setMessage("رابط التحقق غير صالح.");
        return;
      }
      verifyEmail(token)
        .then((res) => setMessage(`${res.message} يمكنك الآن تسجيل الدخول.`))
        .catch((error) => setMessage(`فشل التحقق: ${String(error)}`));
    }, []);

    return (
      <main className="container">
        <section className="results">
          <h2>تأكيد البريد الإلكتروني</h2>
          <p>{message}</p>
          <Link to="/login">الذهاب إلى تسجيل الدخول</Link>
        </section>
      </main>
    );
  }

  function PatientBookingPage() {
    return (
      <AuthLayout>
        <DoctorSearch
          nameFilter={nameFilter}
          specialtyFilter={specialtyFilter}
          cityFilter={cityFilter}
          onNameChange={setNameFilter}
          onSpecialtyChange={setSpecialtyFilter}
          onCityChange={setCityFilter}
        />
        <section className="results">
          <h2>الأطباء ({filteredDoctors.length})</h2>
          {loadingDoctors ? <p>جار تحميل بيانات الأطباء من الخادم...</p> : null}
          {errorMessage ? <p className="status-message">{errorMessage}</p> : null}
          <div className="cards-grid">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card-wrap">
                <DoctorCard doctor={doctor} />
                <button type="button" onClick={() => setBookingDoctorId(doctor.id)}>
                  اختيار للحجز
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="results">
          <h2>حجز موعد</h2>
          <form className="inline-form" onSubmit={handleCreateAppointment}>
            <select
              value={bookingDoctorId ?? ""}
              onChange={(e) => setBookingDoctorId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">اختر الطبيب</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={bookingDateTime}
              onChange={(e) => setBookingDateTime(e.target.value)}
            />
            <input
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              placeholder="ملاحظات (اختياري)"
            />
            <button type="submit">إرسال الحجز</button>
          </form>
          {bookingMessage ? <p className="status-message">{bookingMessage}</p> : null}
        </section>
      </AuthLayout>
    );
  }

  function DoctorDashboardPage() {
    return (
      <AuthLayout>
        <DoctorDashboard selectedDoctorId={currentUser?.doctorId ?? null} />
      </AuthLayout>
    );
  }

  function AdminDoctorsPage() {
    return (
      <AuthLayout>
        <DoctorSearch
          nameFilter={nameFilter}
          specialtyFilter={specialtyFilter}
          cityFilter={cityFilter}
          onNameChange={setNameFilter}
          onSpecialtyChange={setSpecialtyFilter}
          onCityChange={setCityFilter}
        />
        <section className="results">
          <h2>لوحة المشرف - اختيار طبيب</h2>
          <div className="cards-grid">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card-wrap">
                <DoctorCard doctor={doctor} />
                <button type="button" onClick={() => setSelectedDoctorId(doctor.id)}>
                  فتح لوحة الطبيب
                </button>
              </div>
            ))}
          </div>
        </section>
        {selectedDoctorId ? <DoctorDashboard selectedDoctorId={selectedDoctorId} /> : null}
      </AuthLayout>
    );
  }

  function AppointmentsPage() {
    return (
      <AuthLayout>
        <section className="results">
          <h2>{currentUser?.role === "admin" ? "كل المواعيد" : "مواعيدي"}</h2>
          {appointments.length === 0 ? <p>لا توجد مواعيد حاليا.</p> : null}
          <ul className="slot-list">
            {appointments.map((item) => (
              <li key={item.id}>
                <span>
                  #{item.id} - {item.patientName} - {item.doctorName} -{" "}
                  {new Date(item.startAt).toLocaleString("ar-SY")}
                </span>
                <strong>
                  {{
                    pending: "قيد الانتظار",
                    confirmed: "مؤكد",
                    completed: "مكتمل",
                    cancelled: "ملغي",
                    no_show: "لم يحضر"
                  }[item.status]}
                </strong>
              </li>
            ))}
          </ul>
        </section>
      </AuthLayout>
    );
  }

  function HomeRedirect() {
    if (!currentUser) return <Navigate to="/browse" replace />;
    if (currentUser.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
    if (currentUser.role === "patient") return <Navigate to="/patient/booking" replace />;
    return <Navigate to="/admin/doctors" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/browse" element={<PublicBrowsePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/patient" element={<RegisterPatientPage />} />
      <Route path="/register/doctor" element={<RegisterDoctorPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/401" element={<UnauthorizedPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route
        path="/patient/booking"
        element={
          <RequireAuth allowedRoles={["patient"]}>
            <PatientBookingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <RequireAuth allowedRoles={["doctor"]}>
            <DoctorDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <RequireAuth allowedRoles={["admin"]}>
            <AdminDoctorsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/appointments"
        element={
          <RequireAuth allowedRoles={["patient", "doctor", "admin"]}>
            <AppointmentsPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
