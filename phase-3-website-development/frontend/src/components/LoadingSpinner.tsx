import { Loader as Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "جار التحميل..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      <p className="text-sm text-neutral-500">{text}</p>
    </div>
  );
}
