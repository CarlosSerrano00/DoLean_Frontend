import { useState } from "react";
import { Check, Database, Headphones, Info, Save, UserCircle, Waves } from "lucide-react";
import { useSession } from "../../../entities/user";
import { useToast } from "../../../shared/lib/hooks/useToast";
import { Toast } from "../../../shared/ui";

export function SettingsPage() {
  const { user, setUser } = useSession();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const { toast, showToast, dismissToast } = useToast();

  function submit(event) {
    event.preventDefault();
    setUser({ ...user, name: name.trim(), email: email.trim() });
    showToast("Los datos visibles de tu perfil se actualizaron en este navegador.", {
      title: "Perfil guardado",
      tone: "success"
    });
  }

  return (
    <section className="page-section narrow-section">
      <div className="page-title-row">
        <div>
          <span className="section-kicker">PREFERENCIAS</span>
          <h1>Configuración</h1>
          <p>Administra tu perfil y consulta el estado de la integración.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel-card settings-card">
          <div className="panel-heading">
            <div>
              <h2>Perfil de usuario</h2>
              <p>Estos datos se guardan en localStorage.</p>
            </div>
            <UserCircle size={20} />
          </div>
          <form className="form-stack" onSubmit={submit}>
            <label className="field">
              <span className="field-label">Nombre completo</span>
              <input className="plain-input" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label className="field">
              <span className="field-label">Correo electrónico</span>
              <input
                className="plain-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <div className="settings-note">
              <Info size={15} />
              No hay un servicio de usuarios conectado en esta versión.
            </div>
            <button className="btn btn-primary" type="submit">
              <Save size={15} /> Guardar perfil
            </button>
          </form>
        </div>

        <div className="settings-column">
          <div className="panel-card settings-card">
            <div className="panel-heading">
              <div>
                <h2>Motor de audio</h2>
                <p>Capacidades disponibles en el navegador.</p>
              </div>
              <Waves size={19} />
            </div>
            <dl className="settings-list">
              <div>
                <dt>Decodificación de audio</dt>
                <dd className="text-success"><Check size={13} /> Web Audio API</dd>
              </div>
              <div>
                <dt>Reproducción</dt>
                <dd className="text-success"><Check size={13} /> Elemento de audio</dd>
              </div>
              <div>
                <dt>Grabación</dt>
                <dd className="text-success"><Check size={13} /> MediaRecorder</dd>
              </div>
              <div>
                <dt>Corrección de afinación</dt>
                <dd className="text-warning">Pendiente de backend</dd>
              </div>
            </dl>
          </div>

          <div className="panel-card settings-card">
            <div className="panel-heading">
              <div>
                <h2>Sesión y almacenamiento</h2>
                <p>Datos que permanecen en este equipo.</p>
              </div>
              <Database size={19} />
            </div>
            <dl className="settings-list">
              <div>
                <dt>Proyectos y notas</dt>
                <dd className="mono">localStorage</dd>
              </div>
              <div>
                <dt>Archivos de audio</dt>
                <dd>Memoria de la sesión</dd>
              </div>
              <div>
                <dt>Referencia</dt>
                <dd className="mono">A4 · 440 Hz</dd>
              </div>
              <div>
                <dt>Cuenta</dt>
                <dd className="mono">{user?.email || "Sin sesión"}</dd>
              </div>
            </dl>
            <div className="settings-note">
              <Headphones size={15} />
              Los archivos importados no se suben a ningún servidor y se pierden al recargar.
            </div>
          </div>
        </div>
      </div>

      <Toast {...(toast || {})} onClose={dismissToast} />
    </section>
  );
}
