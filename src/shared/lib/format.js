export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function roundTo(value, step = 0.05) {
  return Math.round(value / step) * step;
}

export function formatTime(totalSeconds = 0) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatTimePrecise(totalSeconds = 0) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  const tenths = Math.floor((safe - Math.floor(safe)) * 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

export function formatFileSize(bytes = 0) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatCents(cents = 0) {
  const value = Number(cents) || 0;
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}

export function formatFrequency(frequency = 0) {
  return `${Number(frequency || 0).toFixed(2)} Hz`;
}
