import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Clock3,
  FileAudio,
  FolderOpen,
  MoreHorizontal,
  Music2,
  Pencil,
  Trash2
} from "lucide-react";
import { buildDemoPeaks } from "../../../shared/lib/audio/waveform";
import { IconButton, StatusPill } from "../../../shared/ui";

export function WaveArt({ small = false, count }) {
  const bars = buildDemoPeaks(count || (small ? 42 : 76), small ? 5 : 3);
  return (
    <div className={`wave-art ${small ? "wave-art-small" : ""}`} aria-hidden="true">
      {bars.map((height, index) => (
        <i key={index} style={{ height: `${Math.max(8, height * 100)}%` }} />
      ))}
    </div>
  );
}

export function ProjectCard({ project, onOpen, onAnalysis, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function closeOnOutside(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  function run(action) {
    setMenuOpen(false);
    action?.();
  }

  return (
    <article className="project-card">
      <button
        type="button"
        className="project-main"
        onClick={onOpen}
      >
        <span className="sr-only">Abrir editor de </span>
        <span className="project-thumb">
          <WaveArt small />
          <span className="project-thumb-icon"><Music2 size={18} /></span>
        </span>
        <span className="project-card-body">
          <span className="project-title-row">
            <strong>{project.name}</strong>
            <StatusPill status={project.status} />
          </span>
          <span className="project-meta">
            <span><FileAudio size={12} /> {project.source || "Sin archivo"}</span>
            <span><Clock3 size={12} /> {project.date}</span>
            <span className="mono project-duration">{project.duration || "00:00"}</span>
          </span>
        </span>
      </button>

      <div className="project-menu-wrap" ref={menuRef}>
        <IconButton
          label={`Acciones de ${project.name}`}
          active={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <MoreHorizontal size={17} />
        </IconButton>
        {menuOpen && (
          <div className="popover project-menu" role="menu">
            <button role="menuitem" onClick={() => run(onOpen)}>
              <FolderOpen size={15} /> Abrir editor
            </button>
            {onAnalysis && (
              <button role="menuitem" onClick={() => run(onAnalysis)}>
                <Activity size={15} /> Ver análisis
              </button>
            )}
            {onRename && (
              <>
                <div className="popover-separator" />
                <button role="menuitem" onClick={() => run(onRename)}>
                  <Pencil size={15} /> Renombrar
                </button>
              </>
            )}
            {onDelete && (
              <button role="menuitem" className="danger" onClick={() => run(onDelete)}>
                <Trash2 size={15} /> Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
