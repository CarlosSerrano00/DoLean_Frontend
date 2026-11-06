import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../../../entities/user";
import { AuthLayout } from "../../../widgets/auth-layout";
import { createDemoSession, validateLoginCredentials } from "../../../features/authentication";
import { Spinner } from "../../../shared/ui";

export function LoginPage() {
  const { setUser } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@dolean.app");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event) {
    event.preventDefault();
    if (loading) return;
    const validationError = validateLoginCredentials(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setUser(createDemoSession(email));
      navigate("/app");
    }, 520);
  }

  return (
    <AuthLayout>
      <div className="auth-heading">
        <span className="auth-kicker">BIENVENIDO DE NUEVO</span>
        <h2>Iniciar sesión</h2>
        <p>Entra en tu espacio de trabajo para continuar afinando.</p>
      </div>

      <form className="form-stack" onSubmit={submit} aria-busy={loading}>
        <label className="field">
          <span className="field-label">Correo electrónico</span>
          <span className="input-wrap">
            <Mail size={16} aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
              aria-invalid={Boolean(error)}
            />
          </span>
        </label>

        <label className="field">
          <span className="field-label">Contraseña</span>
          <span className="input-wrap">
            <Lock size={16} aria-hidden="true" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
              aria-invalid={Boolean(error)}
            />
            <button
              type="button"
              className="input-action"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </span>
        </label>

        <div className="form-meta">
          <span className="secure-note">Sesión local de demostración</span>
          <button
            type="button"
            className="text-button"
            onClick={() =>
              setError("La recuperación de contraseña se habilitará cuando exista el servicio de autenticación.")
            }
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button className="btn btn-primary btn-wide auth-submit" type="submit" disabled={loading}>
          {loading ? <><Spinner label="Iniciando sesión" /> Verificando…</> : <>Ingresar <ArrowRight size={16} /></>}
        </button>
      </form>

      <div className="auth-switch">
        ¿No tienes una cuenta? <NavLink to="/register">Crear cuenta</NavLink>
      </div>

      <div className="demo-hint">
        <Sparkles size={14} />
        <span>Acceso demo: <strong className="mono">demo@dolean.app</strong> / <strong className="mono">demo1234</strong></span>
      </div>
    </AuthLayout>
  );
}
