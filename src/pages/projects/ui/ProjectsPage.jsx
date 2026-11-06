import { useState } from "react";
import { FolderOpen, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectCard, useProjects } from "../../../entities/project";

export function ProjectsPage() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const filtered = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="page-section">
      <div className="page-title-row"><div><span className="section-kicker">BIBLIOTECA</span><h1>Mis proyectos</h1><p>Organiza tus grabaciones y sesiones de trabajo.</p></div><button className="btn btn-primary" onClick={() => navigate("/app")}><Plus size={17} /> Nuevo proyecto</button></div>
      <div className="toolbar"><div className="toolbar-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre..." /></div><span className="muted-count">{filtered.length} proyectos</span></div>
      <div className="project-grid">{filtered.map(project => <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/app/editor/${project.id}`)} />)}</div>
      {filtered.length === 0 && <div className="empty-state"><FolderOpen size={26} /><h3>No encontramos proyectos</h3><p>Prueba con otro término de búsqueda.</p></div>}
    </section>
  );
}
