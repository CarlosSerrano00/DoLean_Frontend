import { useState } from "react";
import { ChevronRight, FolderOpen, Mic, Plus, Sparkles, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects, ProjectCard, WaveArt } from "../../../entities/project";
import { useSession } from "../../../entities/user";
import { createLocalProject } from "../../../features/create-project";
import { Modal, Toast } from "../../../shared/ui";

export function DashboardPage() {
  const { projects, setProjects } = useProjects();
  const { user } = useSession();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState("");

  function createProject(e) {
    e.preventDefault();
    const project = createLocalProject({ name: projectName, file });
    setProjects([project, ...projects]);
    setCreateOpen(false);
    setProjectName("");
    setFile(null);
    navigate(`/app/editor/${project.id}`);
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  return (
    <>
      <section className="welcome-banner">
        <div className="welcome-copy"><span className="eyebrow"><span className="eyebrow-dot" /> TU ESTUDIO DIGITAL</span><h1>¡Hola, {user?.name?.split(" ")[0] || "músico"}!</h1><p>Tu próximo gran sonido empieza con cada detalle.</p><button className="btn btn-primary" onClick={() => setCreateOpen(true)}><Plus size={17} /> Nuevo proyecto</button></div>
        <div className="welcome-wave"><WaveArt /></div>
        <div className="welcome-glow" />
      </section>
      <section className="section-block">
        <div className="section-heading"><div><span className="section-kicker">TU TRABAJO</span><h2>Proyectos recientes</h2><p>Continúa donde lo dejaste.</p></div><button className="btn btn-ghost" onClick={() => navigate("/app/projects")}>Ver todos <ChevronRight size={16} /></button></div>
        <div className="project-grid">
          {projects.slice(0, 3).map(project => <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/app/editor/${project.id}`)} />)}
          {projects.length === 0 && <div className="empty-state"><div className="empty-icon"><FolderOpen size={26} /></div><h3>Aún no tienes proyectos</h3><p>Crea uno y empieza a trabajar con tu audio.</p><button className="btn btn-primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Crear proyecto</button></div>}
        </div>
      </section>
      <section className="quick-actions">
        <div className="quick-action-copy"><div className="quick-icon"><Sparkles size={20} /></div><div><h3>¿Listo para empezar?</h3><p>Crea un proyecto, carga una grabación o abre el editor para explorar el prototipo.</p></div></div>
        <div className="quick-action-buttons"><button className="btn btn-secondary" onClick={() => setCreateOpen(true)}><Upload size={16} /> Cargar audio</button><button className="btn btn-outline" onClick={() => showToast("La captura desde micrófono se integrará en la siguiente iteración.")}><Mic size={16} /> Grabar audio</button></div>
      </section>
      {createOpen && <Modal title="Nuevo proyecto" onClose={() => setCreateOpen(false)}><form className="form-stack modal-form" onSubmit={createProject}><label className="field-label">Nombre del proyecto<input className="plain-input" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ej. Voz principal" /></label><label className="field-label">Archivo de audio <span className="upload-field"><Upload size={18} /><span>{file ? file.name : "Selecciona un archivo de audio"}</span><input type="file" accept="audio/*" onChange={e => setFile(e.target.files?.[0] || null)} /></span></label><p className="helper-text">Puedes crear el proyecto sin archivo y añadir el audio después. El análisis real requiere conectar el backend.</p><div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setCreateOpen(false)}>Cancelar</button><button type="submit" className="btn btn-primary">Crear proyecto <ChevronRight size={16} /></button></div></form></Modal>}
      {toast && <Toast message={toast} />}
    </>
  );
}
