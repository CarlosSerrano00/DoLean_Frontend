import { useEffect, useState } from "react";
import { FolderOpen, Mic, Plus, Search, Trash2, Upload } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProjectCard, useProjects } from "../../../entities/project";
import { CreateProjectModal } from "../../../features/create-project";
import { removeProject, renameProject } from "../../../features/project-actions";
import { audioLibrary } from "../../../shared/lib/audio/audioLibrary";
import { useToast } from "../../../shared/lib/hooks/useToast";
import { Modal, Toast } from "../../../shared/ui";

const FILTERS = ["Todos", "Listo", "En edición"];

export function ProjectsPage() {
  const { projects, setProjects } = useProjects();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState("Todos");
  const [createIntent, setCreateIntent] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filtered = projects.filter((project) => {
    const matchesQuery = project.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === "Todos" || project.status === filter;
    return matchesQuery && matchesFilter;
  });

  function handleCreated(project) {
    setProjects((current) => [project, ...current]);
    setCreateIntent(null);
    navigate(`/app/editor/${project.id}`);
  }

  function openRename(project) {
    setRenameTarget(project);
    setRenameValue(project.name);
  }

  function submitRename(event) {
    event.preventDefault();
    if (!renameValue.trim()) return;
    setProjects((current) => renameProject(current, renameTarget.id, renameValue));
    showToast("El nombre del proyecto se actualizó.", {
      title: "Proyecto renombrado",
      tone: "success"
    });
    setRenameTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setProjects((current) => removeProject(current, deleteTarget.id));
    audioLibrary.remove(deleteTarget.id);
    showToast(`"${deleteTarget.name}" se eliminó de este navegador.`, {
      title: "Proyecto eliminado",
      tone: "warning"
    });
    setDeleteTarget(null);
  }

  return (
    <section className="page-section">
      <div className="page-title-row">
        <div>
          <span className="section-kicker">BIBLIOTECA</span>
          <h1>Mis proyectos</h1>
          <p>Organiza tus grabaciones y sesiones de afinación.</p>
        </div>
        <div className="page-title-actions">
          <button className="btn btn-secondary" onClick={() => setCreateIntent("import")}>
            <Upload size={15} /> Importar
          </button>
          <button className="btn btn-secondary" onClick={() => setCreateIntent("record")}>
            <Mic size={15} /> Grabar
          </button>
          <button className="btn btn-primary" onClick={() => setCreateIntent("create")}>
            <Plus size={16} /> Nuevo proyecto
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre…"
            aria-label="Buscar proyectos por nombre"
          />
        </div>
        <div className="filter-tabs" role="group" aria-label="Filtrar por estado">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="muted-count mono">
          {filtered.length} / {projects.length}
        </span>
      </div>

      <div className="project-stack project-stack-full">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => navigate(`/app/editor/${project.id}`)}
            onAnalysis={() => navigate(`/app/analysis/${project.id}`)}
            onRename={() => openRename(project)}
            onDelete={() => setDeleteTarget(project)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon"><FolderOpen size={24} /></span>
          <h3>{projects.length === 0 ? "Tu biblioteca está vacía" : "No encontramos proyectos"}</h3>
          <p>
            {projects.length === 0
              ? "Crea tu primera sesión o importa una toma para comenzar."
              : "Prueba con otro término o cambia el filtro de estado."}
          </p>
          {projects.length === 0 ? (
            <button className="btn btn-primary" onClick={() => setCreateIntent("create")}>
              <Plus size={15} /> Crear proyecto
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => { setQuery(""); setFilter("Todos"); }}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {createIntent && (
        <CreateProjectModal
          initialIntent={createIntent}
          onClose={() => setCreateIntent(null)}
          onCreated={handleCreated}
        />
      )}

      {renameTarget && (
        <Modal
          title="Renombrar proyecto"
          description="El cambio se guarda en este navegador."
          onClose={() => setRenameTarget(null)}
        >
          <form className="form-stack" onSubmit={submitRename}>
            <label className="field">
              <span className="field-label">Nombre del proyecto</span>
              <input
                className="plain-input"
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                maxLength={60}
                autoFocus
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setRenameTarget(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={!renameValue.trim()}>
                Guardar nombre
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal
          title="Eliminar proyecto"
          description="Esta acción no se puede deshacer."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="delete-confirm">
            <span className="delete-confirm-icon"><Trash2 size={20} /></span>
            <p>
              Se eliminará <strong>{deleteTarget.name}</strong> y sus notas guardadas en este
              navegador. El archivo de audio original no se borra del equipo.
            </p>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              <Trash2 size={14} /> Eliminar proyecto
            </button>
          </div>
        </Modal>
      )}

      <Toast {...(toast || {})} onClose={dismissToast} />
    </section>
  );
}
