import { Headphones } from "lucide-react";
import { Brand } from "../../../shared/ui";

export function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <section className="auth-visual" aria-hidden="true">
        <div className="auth-visual-top">
          <Brand />
          <span className="auth-visual-badge">PITCH STUDIO</span>
        </div>

        <div className="auth-visual-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> ESTUDIO MONOFÓNICO</span>
          <h1>Afina cada nota.<br /><span>Escucha la diferencia.</span></h1>
          <p>Analiza la afinación, corrige la deriva y trabaja el detalle con precisión de estudio.</p>
        </div>

        <div className="auth-visual-stage">
          <div className="auth-stage-head">
            <span className="auth-stage-label">PITCH TRACK</span>
            <span className="mono">A4 · 440.00 Hz</span>
          </div>
          <div className="auth-stage-grid" />
          <div className="auth-stage-curve">
            <svg viewBox="0 0 620 150" preserveAspectRatio="none">
              <path
                d="M0 92 C36 92 52 72 86 78 S136 112 174 96 S222 48 262 62 S310 118 348 94 S396 58 434 74 S486 102 524 84 S572 54 620 66"
                fill="none"
                stroke="rgba(129,116,248,.85)"
                strokeWidth="2"
              />
              <path
                d="M0 92 C36 92 52 72 86 78 S136 112 174 96 S222 48 262 62 S310 118 348 94 S396 58 434 74 S486 102 524 84 S572 54 620 66 L620 150 L0 150 Z"
                fill="rgba(129,116,248,.09)"
              />
            </svg>
          </div>
          <div className="auth-stage-notes">
            <span style={{ left: "8%", width: "12%" }}>A4</span>
            <span style={{ left: "23%", width: "9%" }}>B4</span>
            <span style={{ left: "35%", width: "16%" }} className="corrected">G4</span>
            <span style={{ left: "54%", width: "10%" }}>A4</span>
            <span style={{ left: "67%", width: "13%" }} className="selected">C5</span>
            <span style={{ left: "83%", width: "12%" }}>B4</span>
          </div>
          <div className="auth-stage-playhead" />
          <div className="auth-stage-readout">
            <span>DERIVA MEDIA</span>
            <strong className="mono">±12.5 cents</strong>
          </div>
        </div>

        <div className="auth-visual-foot">
          <Headphones size={15} />
          <span>Diseñado para escuchar cada detalle.</span>
          <span className="auth-visual-rule" />
          <span className="mono">A4 = 440 Hz</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-mobile-brand"><Brand /></div>
        <div className="auth-card">{children}</div>
        <p className="auth-footer">© 2026 DoLean · Prototipo frontend</p>
      </section>
    </main>
  );
}
