import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BrowsePage from "./pages/BrowsePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import PatientBookingPage from "./pages/PatientBookingPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AdminDoctorsPage from "./pages/AdminDoctorsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ErrorPage from "./pages/ErrorPage";

type UserRole = "patient" | "doctor" | "admin";

function RequireAuth({ allowedRoles, children }: { allowedRoles: UserRole[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/401" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/403" replace />;
  return <>{children}</>;
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/browse" replace />;
  if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
  if (user.role === "patient") return <Navigate to="/patient/booking" replace />;
  return <Navigate to="/admin/doctors" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:role" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/401" element={<ErrorPage code={401} />} />
        <Route path="/403" element={<ErrorPage code={403} />} />
        <Route
          path="/patient/booking"
          element={<RequireAuth allowedRoles={["patient"]}><PatientBookingPage /></RequireAuth>}
        />
        <Route
          path="/doctor/dashboard"
          element={<RequireAuth allowedRoles={["doctor"]}><DoctorDashboardPage /></RequireAuth>}
        />
        <Route
          path="/admin/doctors"
          element={<RequireAuth allowedRoles={["admin"]}><AdminDoctorsPage /></RequireAuth>}
        />
        <Route
          path="/appointments"
          element={<RequireAuth allowedRoles={["patient", "doctor", "admin"]}><AppointmentsPage /></RequireAuth>}
        />
        <Route path="*" element={<ErrorPage code={404} />} />
      </Route>
    </Routes>
  );
}
