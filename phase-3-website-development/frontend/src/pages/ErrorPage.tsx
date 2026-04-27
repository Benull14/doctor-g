import { Link } from "react-router-dom";
import { ShieldAlert, Lock, FileQuestionMark as FileQuestion } from "lucide-react";

const errorConfig = {
  401: {
    icon: Lock,
    title: "غير مصرح",
    description: "يجب تسجيل الدخول للوصول إلى هذه الصفحة",
    action: { label: "تسجيل الدخول", to: "/login" },
  },
  403: {
    icon: ShieldAlert,
    title: "ممنوع",
    description: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
    action: { label: "العودة للرئيسية", to: "/" },
  },
  404: {
    icon: FileQuestion,
    title: "الصفحة غير موجودة",
    description: "لم يتم العثور على الصفحة التي تبحث عنها",
    action: { label: "العودة للرئيسية", to: "/" },
  },
};

export default function ErrorPage({ code }: { code: 401 | 403 | 404 }) {
  const { icon: Icon, title, description, action } = errorConfig[code];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <Icon className="w-10 h-10 text-neutral-400" />
        </div>
        <p className="text-6xl font-bold text-neutral-300 mb-2">{code}</p>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h1>
        <p className="text-neutral-500 mb-8">{description}</p>
        <Link to={action.to} className="btn-primary btn-lg no-underline">{action.label}</Link>
      </div>
    </div>
  );
}
