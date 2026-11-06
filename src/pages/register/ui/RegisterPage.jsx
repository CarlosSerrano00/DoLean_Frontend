import { useState } from "react";
import { ArrowRight, Lock, Mail, Sparkles, UserCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../../../entities/user";
import { AuthLayout } from "../../../widgets/auth-layout";
import { createDemoUser, validateRegistration } from "../../../features/authentication";
import { Spinner } from "../../../shared/ui";

export function RegisterPage() {
  const { setUser } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  function submit(event) {
    event.preventDefault();
    if (loading) return;
    const validationError = validateRegistration({ ...form, accepted });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setUser(createDemoUser(form.name, form.email));
      navigate("/app");
    }, 520);
  }

  return (
    <AuthLayout>
      <div className="auth-heading">
        <span className="auth-kicker">EMPIEZA A CREAR</span>
        <h2>Crear cuenta</h2>
        <p>Prepara tu espacio de trabajo. Todo queda en este navegador.</p>
      </div>

      <form className="form-stack" onSubmit={submit} aria-busy={loading}>
        <label className="field">
          <span className="field-label">Nombre completo</span>
          <span className="input-wrap">
            <UserCircle size={16} aria-hidden="true" />
            <input value={form.name} onChange={update("name")} placeholder="Tu nombre" autoComplete="name" required />
          </span>
        </label>

        <label className="field">
          <span className="field-label">Correo electrónico</span>
          <span className="input-wrap">
            <Mail size={16} aria-hidden="true" />
            <input type="email" value={form.email} onChange={update("email")} placeholder="nombre@correo.com" autoComplete="email" required />
          </span>
        </label>

        <div className="form-grid-2">
          <label className="field">
            <span className="field-label">Contraseña</span>
            <span className="input-wrap">
              <Lock size={16} aria-hidden="true" />
              <input type="password" value={form.password} onChange={update("password")} placeholder="Mínimo 6 caracteres" autoComplete="new-password" required />
            </span>
          </label>
          <label className="field">
            <span className="field-label">Confirmar</span>
            <span className="input-wrap">
              <Lock size={16} aria-hidden="true" />
              <input type="password" value={form.confirm} onChange={update("confirm")} placeholder="Repite la contraseña" autoComplete="new-password" required />
            </span>
          </label>
        </div>

        <label className="check-label terms-check">
          <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
          Acepto las condiciones de uso de este prototipo.
        </label>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button className="btn btn-primary btn-wide auth-submit" type="submit" disabled={loading}>
          {loading ? <><Spinner label="Creando cuenta" /> Creando cuenta…</> : <>Crear cuenta <ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="auth-switch">
        ¿Ya tienes una cuenta? <NavLink to="/login">Inicia sesión</NavLink>
      </div>

      <div className="demo-hint">
        <Sparkles size={14} />
        Registro local de demostración. No se envía información a un servidor.
      </div>
    </AuthLayout>
  );
}
