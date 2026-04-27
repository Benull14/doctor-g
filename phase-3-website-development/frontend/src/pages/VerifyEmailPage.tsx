import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, CircleCheck as CheckCircle, Circle as XCircle, Loader as Loader2 } from "lucide-react";
import { verifyEmail } from "../modules/auth/api";

export default function VerifyEmailPage() {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("جار التحقق من البريد الإلكتروني...");

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      setStatus("error");
      setMessage("رابط التحقق غير صالح");
      return;
    }
    verifyEmail(token)
      .then((res) => { setStatus("success"); setMessage(res.message); })
      .catch((err) => { setStatus("error"); setMessage(String(err)); });
  }, [location.search]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md text-center animate-fade-in">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
          status === "loading" ? "bg-primary-100" : status === "success" ? "bg-accent-100" : "bg-error-100"
        }`}>
          {status === "loading" && <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />}
          {status === "success" && <CheckCircle className="w-8 h-8 text-accent-600" />}
          {status === "error" && <XCircle className="w-8 h-8 text-error-600" />}
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">
          {status === "loading" ? "جار التحقق" : status === "success" ? "تم التحقق بنجاح" : "فشل التحقق"}
        </h1>
        <p className="text-sm text-neutral-600 mb-6">{message}</p>
        <Link to="/login" className="btn-primary no-underline">
          <Mail className="w-4 h-4" />
          الذهاب إلى تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
