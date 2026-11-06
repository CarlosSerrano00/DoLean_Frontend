import { useState } from "react";
import { Check, CheckCircle2, UserCircle } from "lucide-react";
import { useSession } from "../../../entities/user";

export function SettingsPage() {
  const { user, setUser } = useSession();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);
  function submit(e) {
    e.preventDefault();
    setUser({ ...user, name, email });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }
  return <section className="page-section narrow-section"><div className="page-title-row"><div><span className="section-kicker">PREFERENCIAS</span><h1>Configuración</h1><p>Administra los datos visibles de tu cuenta de demostración.</p></div></div><div className="panel-card settings-card"><div className="panel-heading"><div><h3>Perfil de usuario</h3><p>Estos datos se guardan localmente en este navegador.</p></div><UserCircle size={20} /></div><form className="form-stack" onSubmit={submit}><label className="field-label">Nombre completo<input className="plain-input" value={name} onChange={e => setName(e.target.value)} required /></label><label className="field-label">Correo electrónico<input className="plain-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><div className="settings-note"><CheckCircle2 size={16} /> No hay conexión a un servicio de usuarios en esta versión.</div><button className="btn btn-primary" type="submit"><Check size={16} /> Guardar perfil</button>{saved && <span className="success-inline">Cambios guardados.</span>}</form></div></section>;
}
