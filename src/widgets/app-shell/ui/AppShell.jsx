import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FolderOpen,
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  X
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../../entities/user";
import { Brand, Modal, StatusPill } from "../../../shared/ui";

export const navItems = [
  { to: "/app", label: "Inicio", icon: Home, end: true },
  { to: "/app/projects", label: "Mis proyectos", icon: FolderOpen }
];

export function AppShell() {
  const { user, setUser } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popover, setPopover] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isEditor = /^\/app\/editor\//.test(location.pathname);

  useEffect(() => {
    setMobileOpen(false);
    setPopover(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!popover) return undefined;

    function closeOnOutside(event) {
      if (!event.target.closest?.('.popover, [aria-expanded="true"]')) setPopover(null);
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") setPopover(null);
    }

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [popover]);

  if (isEditor) {
    return <Outlet />;
  }

  const pageTitle = location.pathname.includes("/analysis")
    ? "Análisis"
    : location.pathname.includes("/projects")
      ? "Mis proyectos"
      : location.pathname.includes("/settings")
        ? "Configuración"
        : "Inicio";

  function logout() {
    setUser(null);
    navigate("/login");
  }

  function submitSearch(event) {
    if (event.key !== "Enter") return;
    const query = search.trim();
    navigate(query ? `/app/projects?q=${encodeURIComponent(query)}` : "/app/projects");
  }

  return (
    <div
      className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${
        mobileOpen ? "mobile-nav-open" : ""
      }`}
    >
      <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <aside className="sidebar" aria-label="Navegación principal">
        <div className="sidebar-brand">
          <Brand compact={sidebarCollapsed} />
        </div>

        <div className="sidebar-label">{sidebarCollapsed ? "···" : "ESPACIO DE TRABAJO"}</div>
        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={18} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          <div className="side-divider" />
          <NavLink
            to="/app/settings"
            className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
            title={sidebarCollapsed ? "Configuración" : undefined}
          >
            <Settings size={18} />
            {!sidebarCollapsed && <span>Configuración</span>}
          </NavLink>
          <button className="side-link" onClick={() => setHelpOpen(true)}>
            <CircleHelp size={18} />
            {!sidebarCollapsed && <span>Ayuda</span>}
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini-wrap">
            <div className="user-mini">
              <div className="avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</div>
              {!sidebarCollapsed && (
                <div className="user-mini-info">
                  <strong>{user?.name || "Usuario"}</strong>
                  <span>{user?.email || "Cuenta local"}</span>
                </div>
              )}
              {!sidebarCollapsed && (
                <button
                  className="icon-button tiny"
                  onClick={() => setPopover(popover === "user" ? null : "user")}
                  aria-label="Opciones de usuario"
                  aria-expanded={popover === "user"}
                >
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
            {popover === "user" && !sidebarCollapsed && (
              <div className="popover user-menu">
                <div className="popover-heading">Sesión local</div>
                <button onClick={() => navigate("/app/settings")}>
                  <Settings size={15} /> Mi perfil
                </button>
                <div className="popover-separator" />
                <button onClick={logout}>
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
          {sidebarCollapsed && (
            <button className="side-link" onClick={logout} title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          )}
        </div>

        <button
          className="collapse-sidebar"
          onClick={() => setSidebarCollapsed((value) => !value)}
          title={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
          aria-label={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu icon-button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Abrir menú de navegación"
            >
              <Menu size={19} />
            </button>
            <span className="breadcrumb-muted">DoLean</span>
            <ChevronRight size={13} />
            <strong>{pageTitle}</strong>
          </div>

          <div className="topbar-right">
            <div className="top-search">
              <Search size={15} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={submitSearch}
                placeholder="Buscar proyectos…"
                aria-label="Buscar proyectos"
              />
            </div>

            <div className="topbar-popover-wrap">
              <button
                className="icon-button notification-button"
                aria-label="Notificaciones"
                aria-expanded={popover === "notifications"}
                onClick={() => setPopover(popover === "notifications" ? null : "notifications")}
              >
                <Bell size={17} />
                <i />
              </button>
              {popover === "notifications" && (
                <div className="popover notification-popover">
                  <div className="popover-heading">Actividad</div>
                  <div className="notification-empty">
                    <Bell size={16} />
                    <div>
                      <strong>Sin notificaciones</strong>
                      <span>Los resultados del análisis aparecerán aquí cuando se conecte el backend.</span>
                    </div>
                  </div>
                  <div className="popover-separator" />
                  <div className="notification-status">
                    <StatusPill status="Prototipo" />
                    <span className="mono">Sesión local</span>
                  </div>
                </div>
              )}
            </div>

            <button
              className="avatar avatar-top"
              onClick={() => navigate("/app/settings")}
              aria-label="Abrir perfil"
            >
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </button>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {helpOpen && (
        <Modal
          title="Ayuda de DoLean"
          description="Atajos y alcance de este prototipo."
          onClose={() => setHelpOpen(false)}
        >
          <div className="help-grid">
            <section>
              <h4>Editor</h4>
              <dl>
                <div><dt>Seleccionar nota</dt><dd>Clic sobre el bloque</dd></div>
                <div><dt>Mover nota</dt><dd>Herramienta Mover + arrastrar</dd></div>
                <div><dt>Ajustar duración</dt><dd>Arrastrar el borde derecho</dd></div>
                <div><dt>Dividir</dt><dd>Herramienta Dividir + clic</dd></div>
                <div><dt>Eliminar</dt><dd><kbd>Supr</kbd> con la nota enfocada</dd></div>
                <div><dt>Desplazar</dt><dd>Flechas ← → / ↑ ↓</dd></div>
              </dl>
            </section>
            <section>
              <h4>Alcance actual</h4>
              <p className="helper-text">
                La interfaz, el piano roll y el transporte son interactivos. La corrección de
                afinación y el análisis se simulan con datos locales. La importación, la grabación
                y la exportación WAV del audio original funcionan en el navegador.
              </p>
              <div className="help-note">
                <X size={14} />
                El audio no se sube a ningún servidor.
              </div>
            </section>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => setHelpOpen(false)}>Entendido</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
