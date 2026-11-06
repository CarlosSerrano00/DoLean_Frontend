import {
  Activity,
  ArrowLeft,
  PanelRight,
  Redo2,
  Save,
  Settings,
  Undo2
} from "lucide-react";
import { Brand, IconButton, StatusPill } from "../../../shared/ui";

export function StudioTopbar({
  project,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onBack,
  onSettings,
  onAnalysis,
  onSave,
  onToggleInspector,
  inspectorOpen,
  saveState
}) {
  const saveLabels = {
    saved: "Guardado local",
    dirty: "Cambios sin guardar",
    saving: "Guardando…"
  };

  return (
    <header className="studio-topbar">
      <div className="studio-topbar-left">
        <button className="icon-button back-button" onClick={onBack} aria-label="Volver a proyectos">
          <ArrowLeft size={17} />
        </button>
        <span className="studio-brand"><Brand /></span>
        <span className="studio-divider" aria-hidden="true" />
        <div className="studio-project">
          <strong>{project.name}</strong>
          <div className="studio-project-meta">
            <StatusPill status={project.status || "En edición"} />
            <span className={`save-state save-${saveState}`} aria-live="polite">
              <i aria-hidden="true" />
              {saveLabels[saveState] || saveLabels.saved}
            </span>
          </div>
        </div>
      </div>

      <div className="studio-topbar-actions">
        <div className="undo-group" role="group" aria-label="Historial de cambios">
          <IconButton label="Deshacer" tooltip="Deshacer (Ctrl+Z)" onClick={onUndo} disabled={!canUndo}>
            <Undo2 size={16} />
          </IconButton>
          <IconButton label="Rehacer" tooltip="Rehacer (Ctrl+Shift+Z)" onClick={onRedo} disabled={!canRedo}>
            <Redo2 size={16} />
          </IconButton>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm save-button"
          onClick={onSave}
          aria-label={saveLabels[saveState] ? `Guardar proyecto · ${saveLabels[saveState]}` : "Guardar proyecto"}
        >
          <Save size={14} /> <span>Guardar</span>
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm analysis-link"
          onClick={onAnalysis}
          aria-label="Ver análisis del proyecto"
        >
          <Activity size={14} /> <span>Análisis</span>
        </button>

        <IconButton
          label={inspectorOpen ? "Ocultar inspector" : "Mostrar inspector"}
          tooltip={inspectorOpen ? "Ocultar inspector" : "Mostrar inspector"}
          active={inspectorOpen}
          toggle
          onClick={onToggleInspector}
        >
          <PanelRight size={16} />
        </IconButton>
        <IconButton label="Configuración" tooltip="Configuración" onClick={onSettings}>
          <Settings size={16} />
        </IconButton>
      </div>
    </header>
  );
}
