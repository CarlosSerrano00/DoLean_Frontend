import { Headphones } from "lucide-react";
import { Brand } from "../../../shared/ui";

export function AuthLayout({ children, mode = "login" }) {
  return (
    <main className="auth-page">
      <section className="auth-art">
        <div className="auth-art-top"><Brand /></div>
        <div className="auth-art-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> ESTUDIO DE AFINACIÓN</span>
          <h1>Analiza.<br /><span>Corrige.</span><br />Mejora.</h1>
          <p>Tu estudio de afinación, ahora en la web.</p>
        </div>
        <div className="auth-wave-wrap" aria-hidden="true">
          <div className="auth-wave-line" />
          <div className="auth-eq">{Array.from({ length: 42 }, (_, i) => <i key={i} style={{ height: `${16 + Math.abs(Math.sin(i * 1.17)) * 74 + (i % 5) * 4}px` }} />)}</div>
        </div>
        <div className="auth-art-foot"><Headphones size={16} /> Un espacio para escuchar cada detalle.</div>
      </section>
      <section className="auth-form-side">
        <div className="auth-mobile-brand"><Brand /></div>
        <div className="auth-card">
          {children}
        </div>
        <p className="auth-footer">© 2026 DoLean · Prototipo frontend</p>
      </section>
    </main>
  );
}
