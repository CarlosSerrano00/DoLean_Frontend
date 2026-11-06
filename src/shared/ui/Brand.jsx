import { AudioWaveform } from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <AudioWaveform size={23} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="brand-name">
          Do<span>Lean</span>
        </span>
      )}
    </div>
  );
}
