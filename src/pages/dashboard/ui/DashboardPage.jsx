import { useState } from "react";
import { ChevronRight, FolderOpen, Mic, Plus, Upload, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectCard, WaveArt, useProjects } from "../../../entities/project";
import { useSession } from "../../../entities/user";
import { CreateProjectModal } from "../../../features/create-project";
import { useToast } from "../../../shared/lib/hooks/useToast";
import { Toast } from "../../../shared/ui";

export function DashboardPage() {
  const { projects, setProjects } = useProjects();
  const { user } = useSession();
  const navigate = useNavigate();
  const [createIntent, setCreateIntent] = useState(null);
  const { toast, showToast, dismissToast } = useToast();
  const latest = projects[0];

  function handleCreated(project) {
    setProjects((current) => [project, ...current]);
    setCreateIntent(null);
    showToast("El proyecto se creó y está listo para editar.", {
      title: "Nuevo proyecto",
      tone: "success"
    });
    navigate(`/app/editor/${project.id}`);
  }

  return (
    <>
      <section className="studio-hero">
        <div className="studio-hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> SESIÓN DE TRABAJO</span>
          <h1>Hola, {user?.name?.split(" ")[0] || "músico"}.</h1>
          <p>
            Importa una toma, analiza su afinación y trabaja cada nota hasta que suene como
            debe sonar.
          </p>
          <div className="studio-hero-actions">
            <button className="btn btn-primary" onClick={() => setCreateIntent("create")}>
              <Plus size={16} /> Nuevo proyecto
            </button>
            <button className="btn btn-secondary" onClick={() => setCreateIntent("import")}>
              <Upload size={15} /> Importar audio
            </button>
            <button className="btn btn-ghost" onClick={() => setCreateIntent("record")}>
              <Mic size={15} /> Grabar
            </button>
          </div>
          <div className="studio-hero-meta">
            <span className="mono">{projects.length} {projects.length === 1 ? "proyecto local" : "proyectos locales"}</span>
            <span className="studio-hero-separator" />
            <span>Cuenta local · sin backend</span>
          </div>
        </div>

        <div className="studio-hero-visual">
          <div className="hero-wave-head">
            <span className="mono">A4</span>
            <span>440.00 Hz</span>
            <span className="status-pill status-ready">Referencia</span>
          </div>
          <div className="hero-wave">
            <WaveArt count={64} />
            <span className="hero-wave-playhead" />
          </div>
          <div className="hero-wave-foot">
            <span className="mono">00:00</span>
            <span>{latest ? `Última sesión · ${latest.name}` : "Sin sesiones todavía"}</span>
            <span className="mono">{latest?.duration || "00:00"}</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="section-kicker">TU TRABAJO</span>
            <h2>Proyectos recientes</h2>
            <p>Continúa exactamente donde lo dejaste.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/app/projects")}>
            Ver todos <ChevronRight size={15} />
          </button>
        </div>

        <div className="project-stack">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => navigate(`/app/editor/${project.id}`)}
              onAnalysis={() => navigate(`/app/analysis/${project.id}`)}
            />
          ))}

          {projects.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon"><FolderOpen size={24} /></span>
              <h3>Aún no hay proyectos</h3>
              <p>Crea una sesión o importa una toma para empezar a afinar.</p>
              <div className="empty-actions">
                <button className="btn btn-primary" onClick={() => setCreateIntent("create")}>
                  <Plus size={15} /> Crear proyecto
                </button>
                <button className="btn btn-secondary" onClick={() => setCreateIntent("import")}>
                  <Upload size={15} /> Importar audio
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="workflow-strip" aria-label="Flujo de trabajo de DoLean">
        <span className="workflow-step"><Upload size={15} /><strong>01</strong> Importa</span>
        <span className="workflow-line" aria-hidden="true" />
        <span className="workflow-step"><Waves size={15} /><strong>02</strong> Analiza</span>
        <span className="workflow-line" aria-hidden="true" />
        <span className="workflow-step"><Mic size={15} /><strong>03</strong> Corrige</span>
        <span className="workflow-line" aria-hidden="true" />
        <span className="workflow-step"><ChevronRight size={15} /><strong>04</strong> Exporta</span>
        <span className="workflow-note">La corrección real se conectará al motor de backend.</span>
      </section>

      {createIntent && (
        <CreateProjectModal
          initialIntent={createIntent}
          onClose={() => setCreateIntent(null)}
          onCreated={handleCreated}
        />
      )}

      <Toast {...(toast || {})} onClose={dismissToast} />
    </>
  );
}
