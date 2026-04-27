import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Stethoscope, CalendarDays, LayoutDashboard, Users, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const roleLabels: Record<string, string> = {
  patient: "مريض",
  doctor: "طبيب",
  admin: "مشرف",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  const linkCls = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 no-underline ${
      isActive(path)
        ? "bg-primary-50 text-primary-700"
        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
    }`;

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-neutral-900 block leading-tight">دليل الأطباء</span>
              <span className="text-[11px] text-neutral-400 hidden sm:block">نظام حجز المواعيد</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {!user && (
              <>
                <Link to="/browse" className={linkCls("/browse")}>
                  <Stethoscope className="w-4 h-4" /> تصفح الأطباء
                </Link>
                <Link to="/login" className={linkCls("/login")}>
                  <LogIn className="w-4 h-4" /> تسجيل الدخول
                </Link>
                <Link to="/register/patient" className="btn-primary btn-sm mr-2 no-underline">
                  <UserPlus className="w-4 h-4" /> إنشاء حساب
                </Link>
              </>
            )}
            {user?.role === "patient" && (
              <>
                <Link to="/patient/booking" className={linkCls("/patient/booking")}>
                  <Stethoscope className="w-4 h-4" /> حجز موعد
                </Link>
                <Link to="/appointments" className={linkCls("/appointments")}>
                  <CalendarDays className="w-4 h-4" /> مواعيدي
                </Link>
              </>
            )}
            {user?.role === "doctor" && (
              <>
                <Link to="/doctor/dashboard" className={linkCls("/doctor/dashboard")}>
                  <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                </Link>
                <Link to="/appointments" className={linkCls("/appointments")}>
                  <CalendarDays className="w-4 h-4" /> المواعيد
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin/doctors" className={linkCls("/admin/doctors")}>
                  <Users className="w-4 h-4" /> إدارة الأطباء
                </Link>
                <Link to="/appointments" className={linkCls("/appointments")}>
                  <CalendarDays className="w-4 h-4" /> كل المواعيد
                </Link>
              </>
            )}
            {user && (
              <div className="flex items-center gap-3 mr-4 pr-4 border-r border-neutral-200">
                <div className="text-left">
                  <p className="text-sm font-semibold text-neutral-800 leading-tight m-0">{user.name}</p>
                  <p className="text-[11px] text-neutral-400 m-0">{roleLabels[user.role]}</p>
                </div>
                <button onClick={logout} className="btn-ghost btn-sm text-error-600 hover:bg-error-50 hover:text-error-700">
                  <LogOut className="w-4 h-4" /> خروج
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden btn-ghost p-2"
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {!user && (
              <>
                <Link to="/browse" className={linkCls("/browse")} onClick={() => setMobileOpen(false)}>
                  <Stethoscope className="w-4 h-4" /> تصفح الأطباء
                </Link>
                <Link to="/login" className={linkCls("/login")} onClick={() => setMobileOpen(false)}>
                  <LogIn className="w-4 h-4" /> تسجيل الدخول
                </Link>
                <Link to="/register/patient" className={linkCls("/register/patient")} onClick={() => setMobileOpen(false)}>
                  <UserPlus className="w-4 h-4" /> إنشاء حساب
                </Link>
              </>
            )}
            {user?.role === "patient" && (
              <>
                <Link to="/patient/booking" className={linkCls("/patient/booking")} onClick={() => setMobileOpen(false)}>
                  <Stethoscope className="w-4 h-4" /> حجز موعد
                </Link>
                <Link to="/appointments" className={linkCls("/appointments")} onClick={() => setMobileOpen(false)}>
                  <CalendarDays className="w-4 h-4" /> مواعيدي
                </Link>
              </>
            )}
            {user?.role === "doctor" && (
              <>
                <Link to="/doctor/dashboard" className={linkCls("/doctor/dashboard")} onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                </Link>
                <Link to="/appointments" className={linkCls("/appointments")} onClick={() => setMobileOpen(false)}>
                  <CalendarDays className="w-4 h-4" /> المواعيد
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin/doctors" className={linkCls("/admin/doctors")} onClick={() => setMobileOpen(false)}>
                  <Users className="w-4 h-4" /> إدارة الأطباء
                </Link>
                <Link to="/appointments" className={linkCls("/appointments")} onClick={() => setMobileOpen(false)}>
                  <CalendarDays className="w-4 h-4" /> كل المواعيد
                </Link>
              </>
            )}
            {user && (
              <div className="pt-3 mt-3 border-t border-neutral-100">
                <p className="text-sm font-semibold text-neutral-800 px-3 mb-2">{user.name} ({roleLabels[user.role]})</p>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error-600 hover:bg-error-50 w-full border-none bg-transparent cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
