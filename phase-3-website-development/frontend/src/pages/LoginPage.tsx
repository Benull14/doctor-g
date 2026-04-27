import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Stethoscope, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else if (user.role === "patient") navigate("/patient/booking");
      else navigate("/admin/doctors");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 m-0">مرحبا بعودتك</h1>
          <p className="text-neutral-500 mt-2">سجل الدخول للوصول إلى حسابك</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">البريد الإلكتروني</label>
              <input
                type="email"
                className="input-field"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="input-label">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pe-12"
                  placeholder="ادخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors bg-transparent border-none cursor-pointer p-0"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full btn-lg" disabled={loading}>
              {loading ? (
                <span className="animate-pulse-soft">جار تسجيل الدخول...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100 text-center space-y-3">
            <p className="text-sm text-neutral-500 m-0">ليس لديك حساب؟</p>
            <div className="flex gap-3 justify-center">
              <Link to="/register/patient" className="btn-secondary btn-sm no-underline">تسجيل كمريض</Link>
              <Link to="/register/doctor" className="btn-secondary btn-sm no-underline">تسجيل كطبيب</Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/browse" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            أو تصفح الأطباء بدون حساب
          </Link>
        </div>
      </div>
    </div>
  );
}
