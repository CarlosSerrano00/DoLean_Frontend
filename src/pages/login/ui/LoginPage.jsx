import { useState } from "react";
import { ChevronRight, Sparkles, UserCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../../../entities/user";
import { AuthLayout } from "../../../widgets/auth-layout";
import { createDemoSession, validateLoginCredentials } from "../../../features/authentication";

export function LoginPage() {
  const { setUser } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@dolean.app");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    const validationError = validateLoginCredentials(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setUser(createDemoSession(email));
    navigate("/app");
  }

  return (
    <AuthLayout>
      <div className="auth-heading">
        <span className="auth-kicker">BIENVENIDO DE NUEVO</span>
        <h2>Iniciar sesión</h2>
        <p>Accede a tu espacio de trabajo para continuar.</p>
      </div>
      <form onSubmit={submit} className="form-stack">
        <label className="field-label">Correo electrónico
          <span className="input-wrap"><UserCircle size={17} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@correo.com" required /></span>
        </label>
        <label className="field-label">Contraseña
          <span className="input-wrap"><span className="input-lock">⌑</span><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" required /><button type="button" className="input-action" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Ocultar" : "Ver"}</button></span>
        </label>
        <div className="form-meta"><label className="check-label"><input type="checkbox" defaultChecked /> Recordarme</label><button type="button" className="text-button" onClick={() => setError("La recuperación de contraseña se conectará cuando exista el servicio de backend.")}>¿Olvidaste tu contraseña?</button></div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-primary btn-wide" type="submit">Ingresar <ChevronRight size={17} /></button>
      </form>
      <div className="auth-switch">¿No tienes una cuenta? <NavLink to="/register">Crear cuenta</NavLink></div>
      <div className="demo-hint"><Sparkles size={14} /> Acceso de demostración: demo@dolean.app / demo1234</div>
    </AuthLayout>
  );
}
