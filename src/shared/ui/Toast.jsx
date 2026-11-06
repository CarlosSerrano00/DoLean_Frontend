import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

export function Toast({ message, title, tone = "success", onClose }) {
  if (!message) return null;
  const Icon = ICONS[tone] || Info;
  return (
    <div className={`toast toast-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <span className="toast-icon" aria-hidden="true">
        <Icon size={14} />
      </span>
      <span className="toast-body">
        {title && <strong className="toast-title">{title}</strong>}
        <span className="toast-message">{message}</span>
      </span>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Cerrar mensaje">
          <X size={13} />
        </button>
      )}
    </div>
  );
}
