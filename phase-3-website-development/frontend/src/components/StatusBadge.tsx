import { Clock, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, CircleSlash } from "lucide-react";

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

const config: Record<AppointmentStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending:   { label: "قيد الانتظار", icon: Clock,          className: "badge badge-pending" },
  confirmed: { label: "مؤكد",         icon: CheckCircle2,    className: "badge badge-confirmed" },
  completed: { label: "مكتمل",        icon: CheckCircle2,    className: "badge badge-completed" },
  cancelled: { label: "ملغي",         icon: XCircle,         className: "badge badge-cancelled" },
  no_show:   { label: "لم يحضر",      icon: AlertTriangle,   className: "badge badge-no_show" },
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const entry = config[status] ?? { label: status, icon: CircleSlash, className: "badge" };
  const Icon = entry.icon;

  return (
    <span className={entry.className}>
      <Icon className="w-3.5 h-3.5" />
      {entry.label}
    </span>
  );
}
