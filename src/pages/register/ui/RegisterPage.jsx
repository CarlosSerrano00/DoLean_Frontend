import { useState } from "react";
import { ChevronRight, Sparkles, UserCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../../../entities/user";
import { AuthLayout } from "../../../widgets/auth-layout";
import { createDemoUser, validateRegistration } from "../../../features/authentication";

export function RegisterPage() {
  const { setUser } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const update = key => e => setForm({ ...form, [key]: e.target.value });

  function submit(e) {
    e.preventDefault();
    const validationError = validateRegistration({ ...form, accepted });
    if (validationError) return setError(validationError);
    setError("");
    setUser(createDemoUser(form.name, form.email));
    navigate("/app");
  }

  return (
    <AuthLayout mode="register">
      <div className="auth-heading">
        <span className="auth-kicker">EMPIEZA A CREAR</span>
        <h2>Crear cuenta</h2>
        <p>Completa tus datos para preparar tu espacio de trabajo.</p>
      </div>
      <form onSubmit={submit} className="form-stack">
        <label className="field-label">Nombre completo
          <span className="input-wrap"><UserCircle size={17} /><input value={form.name} onChange={update("name")} placeholder="Tu nombre" required /></span>
        </label>
        <label className="field-label">Correo electrónico
          <span className="input-wrap"><span className="input-lock">✉</span><input type="email" value={form.email} onChange={update("email")} placeholder="nombre@correo.com" required /></span>
        </label>
        <label className="field-label">Contraseña
          <span className="input-wrap"><span className="input-lock">⌑</span><input type="password" value={form.password} onChange={update("password")} placeholder="Mínimo 6 caracteres" required /></span>
        </label>
        <label className="field-label">Confirmar contraseña
          <span className="input-wrap"><span className="input-lock">⌑</span><input type="password" value={form.confirm} onChange={update("confirm")} placeholder="Repite tu contraseña" required /></span>
        </label>
        <label className="check-label terms-check"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} /> Acepto las condiciones de uso del prototipo.</label>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-primary btn-wide" type="submit">Crear cuenta <ChevronRight size={17} /></button>
      </form>
      <div className="auth-switch">¿Ya tienes una cuenta? <NavLink to="/login">Inicia sesión</NavLink></div>
      <div className="demo-hint"><Sparkles size={14} /> Registro local de demostración, sin conexión a backend.</div>
    </AuthLayout>
  );
}
