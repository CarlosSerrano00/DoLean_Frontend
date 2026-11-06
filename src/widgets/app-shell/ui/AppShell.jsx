import { useState } from "react";
import { Bell, ChevronDown, ChevronRight, CircleHelp, FolderOpen, Home, LogOut, Menu, PanelLeftClose, Search, Settings } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../../entities/user";
import { Brand } from "../../../shared/ui";

export const navItems = [
  { to: "/app", label: "Inicio", icon: Home, end: true },
  { to: "/app/projects", label: "Mis proyectos", icon: FolderOpen },
];

export function AppShell() {
  const { user, setUser } = useSession();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  function logout() {
    setUser(null);
    navigate("/login");
  }

  const pageTitle = location.pathname.includes("/editor") ? "Editor de audio"
    : location.pathname.includes("/analysis") ? "Análisis"
    : location.pathname.includes("/projects") ? "Mis proyectos"
    : location.pathname.includes("/settings") ? "Configuración" : "Inicio";

  return (
    <div className={`app-shell ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <aside className="sidebar">
        <div className="sidebar-brand"><Brand compact={!sidebarOpen} /></div>
        <div className="sidebar-label">{sidebarOpen ? "ESPACIO DE TRABAJO" : " "}</div>
        <nav className="side-nav">
          {navItems.map(item => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`} title={item.label}><item.icon size={18} />{sidebarOpen && <span>{item.label}</span>}</NavLink>)}
          <div className="side-divider" />
          <NavLink to="/app/settings" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`} title="Configuración"><Settings size={18} />{sidebarOpen && <span>Configuración</span>}</NavLink>
          <button className="side-link" onClick={() => window.alert("Centro de ayuda: esta sección se completará en una siguiente iteración.")}><CircleHelp size={18} />{sidebarOpen && <span>Ayuda</span>}</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</div>
            {sidebarOpen && <div className="user-mini-info"><strong>{user?.name || "Usuario"}</strong><span>{user?.email || "Cuenta local"}</span></div>}
            {sidebarOpen && <button className="icon-button tiny" onClick={() => setShowUserMenu(v => !v)} aria-label="Opciones de usuario"><ChevronDown size={15} /></button>}
          </div>
          {showUserMenu && <div className="user-menu"><button onClick={() => navigate("/app/settings")}><Settings size={15} /> Mi perfil</button><button onClick={logout}><LogOut size={15} /> Cerrar sesión</button></div>}
          {!sidebarOpen && <button className="side-link logout-icon" onClick={logout} title="Cerrar sesión"><LogOut size={18} /></button>}
        </div>
        <button className="collapse-sidebar" onClick={() => setSidebarOpen(v => !v)} title={sidebarOpen ? "Contraer menú" : "Expandir menú"}><PanelLeftClose size={16} /></button>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setSidebarOpen(v => !v)}><Menu size={19} /></button><span className="breadcrumb-muted">DoLean</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          <div className="topbar-right">
            <div className="top-search"><Search size={16} /><input placeholder="Buscar proyectos..." onKeyDown={e => { if (e.key === "Enter") navigate("/app/projects"); }} /></div>
            <button className="icon-button notification-button" aria-label="Notificaciones" onClick={() => window.alert("No tienes notificaciones nuevas.")}><Bell size={18} /><i /></button>
            <div className="avatar avatar-top">{(user?.name || "U").slice(0, 1).toUpperCase()}</div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
