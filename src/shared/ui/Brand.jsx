import { AudioWaveform } from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark"><AudioWaveform size={25} strokeWidth={2.6} /></span>
      {!compact && <span className="brand-name">Do<span>Lean</span></span>}
    </div>
  );
}
