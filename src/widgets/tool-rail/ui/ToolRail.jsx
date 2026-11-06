import { Maximize2, MousePointer2, Move, Scissors, StretchHorizontal, ZoomIn, ZoomOut } from "lucide-react";

const TOOLS = [
  { id: "select", label: "Seleccionar notas", icon: MousePointer2, hint: "Seleccionar (V)" },
  { id: "move", label: "Mover notas", icon: Move, hint: "Mover (M)" },
  { id: "split", label: "Dividir notas", icon: Scissors, hint: "Dividir (S)" },
  { id: "resize", label: "Ajustar duración", icon: StretchHorizontal, hint: "Duración (R)" }
];

export function ToolRail({ tool, onToolChange, zoom, onZoomIn, onZoomOut, onZoomReset }) {
  return (
    <nav className="tool-rail" aria-label="Herramientas de edición" role="toolbar" aria-orientation="vertical">
      <div className="tool-group">
        {TOOLS.map(({ id, label, icon: Icon, hint }) => (
          <button
            key={id}
            type="button"
            className={`tool-button ${tool === id ? "active" : ""}`}
            onClick={() => onToolChange(id)}
            aria-label={label}
            aria-pressed={tool === id}
            data-tooltip={hint}
          >
            <Icon size={17} />
          </button>
        ))}
      </div>

      <span className="tool-separator" />

      <div className="tool-group">
        <button
          type="button"
          className="tool-button"
          onClick={onZoomIn}
          aria-label="Acercar la línea temporal"
          data-tooltip="Acercar"
        >
          <ZoomIn size={17} />
        </button>
        <span className="zoom-readout mono" aria-live="polite">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          className="tool-button"
          onClick={onZoomOut}
          aria-label="Alejar la línea temporal"
          data-tooltip="Alejar"
        >
          <ZoomOut size={17} />
        </button>
        <button
          type="button"
          className="tool-button"
          onClick={onZoomReset}
          aria-label="Restablecer zoom"
          data-tooltip="Ajustar al ancho"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </nav>
  );
}
