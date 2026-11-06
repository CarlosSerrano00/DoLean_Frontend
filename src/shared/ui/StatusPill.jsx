export function StatusPill({ status, className = "" }) {
  const tone =
    status === "Listo"
      ? "status-ready"
      : status === "En edición"
        ? "status-edit"
        : "status-neutral";
  return <span className={`status-pill ${tone} ${className}`.trim()}>{status}</span>;
}
