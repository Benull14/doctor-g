import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserPlus, Stethoscope, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { role } = useParams<{ role: string }>();
  const isDoctor = role === "doctor";
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const message = await register({
        name,
        email,
        password,
        phone,
        role: isDoctor ? "doctor" : "patient",
        ...(isDoctor ? { specialty, city } : {}),
      });
      setSuccess(message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${isDoctor ? "bg-accent-600" : "bg-primary-600"}`}>
            {isDoctor ? <Stethoscope className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 m-0">
            {isDoctor ? "تسجيل حساب طبيب" : "تسجيل حساب مريض"}
          </h1>
          <p className="text-neutral-500 mt-2">
            {isDoctor ? "انضم لشبكة الأطباء واستقبل المواعيد" : "أنشئ حسابك واحجز مواعيدك بسهولة"}
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">الاسم الكامل</label>
                <input className="input-field" placeholder="ادخل اسمك" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="input-label">رقم الهاتف</label>
                <input className="input-field" placeholder="+966 5XX XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
              </div>
            </div>

            <div>
              <label className="input-label">البريد الإلكتروني</label>
              <input type="email" className="input-field" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
            </div>

            <div>
              <label className="input-label">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pe-12"
                  placeholder="اختر كلمة مرور قوية"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors bg-transparent border-none cursor-pointer p-0" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isDoctor && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">الاختصاص</label>
                  <input className="input-field" placeholder="مثال: طب عام" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">المدينة</label>
                  <input className="input-field" placeholder="مثال: الرياض" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg px-4 py-3">{error}</div>
            )}
            {success && (
              <div className="bg-accent-50 border border-accent-200 text-accent-700 text-sm rounded-lg px-4 py-3">{success}</div>
            )}

            <button type="submit" className={`w-full btn-lg ${isDoctor ? "btn-accent" : "btn-primary"}`} disabled={loading}>
              {loading ? (
                <span className="animate-pulse-soft">جار إنشاء الحساب...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  إنشاء الحساب
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500 m-0">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">تسجيل الدخول</Link>
            </p>
            {!isDoctor ? (
              <p className="text-sm text-neutral-500 mt-2 m-0">
                هل أنت طبيب؟{" "}
                <Link to="/register/doctor" className="text-accent-600 hover:text-accent-700 font-medium">سجل كطبيب</Link>
              </p>
            ) : (
              <p className="text-sm text-neutral-500 mt-2 m-0">
                هل أنت مريض؟{" "}
                <Link to="/register/patient" className="text-primary-600 hover:text-primary-700 font-medium">سجل كمريض</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
