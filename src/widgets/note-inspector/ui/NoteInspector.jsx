import {
  Crosshair,
  Minus,
  MousePointer2,
  Plus,
  Scissors,
  Trash2,
  X
} from "lucide-react";
import {
  formatCents,
  formatFrequency,
  formatTime,
  formatTimePrecise,
  roundTo
} from "../../../shared/lib/format";
import { pitchToFrequency, pitchToOctave } from "../../../entities/note";

function RangeField({
  label,
  value,
  display,
  min,
  max,
  step,
  unit,
  onChange,
  onStep,
  onEditStart,
  onEditEnd
}) {
  return (
    <div className="inspector-field">
      <div className="inspector-field-head">
        <span>{label}</span>
        <strong className="mono">{display}</strong>
      </div>
      <div className="range-control">
        <button
          type="button"
          className="range-step"
          onClick={() => onStep(-1)}
          aria-label={`Reducir ${label}`}
        >
          <Minus size={12} />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onPointerDown={onEditStart}
          onPointerUp={onEditEnd}
          onKeyDown={onEditStart}
          onKeyUp={onEditEnd}
          onBlur={onEditEnd}
          aria-label={`${label} (${unit})`}
          aria-valuetext={`${display}`}
        />
        <button
          type="button"
          className="range-step"
          onClick={() => onStep(1)}
          aria-label={`Aumentar ${label}`}
        >
          <Plus size={12} />
        </button>
      </div>
      <div className="range-scale mono" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function DriftChart({ drift = [] }) {
  if (!drift.length) {
    return <div className="drift-empty">Sin datos de deriva para esta nota.</div>;
  }

  const width = 220;
  const height = 50;
  const points = drift.map((value, index) => {
    const x = drift.length === 1 ? width / 2 : (index / (drift.length - 1)) * width;
    const y = height / 2 - (Math.max(-50, Math.min(50, value)) / 50) * (height / 2 - 5);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <div className="drift-chart">
      <div className="drift-axis mono" aria-hidden="true">
        <span>+50</span>
        <span>0</span>
        <span>−50</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Deriva de afinación de la nota">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} className="drift-baseline" />
        <polyline points={points.join(" ")} className="drift-line" />
        {points.map((point, index) => {
          const [x, y] = point.split(",");
          return <circle key={index} cx={x} cy={y} r="2" className="drift-dot" />;
        })}
      </svg>
    </div>
  );
}

export function NoteInspector({
  note,
  pitchRows,
  totalDuration,
  onPreview,
  onCommit,
  onEditStart,
  onEditEnd,
  onSetPitch,
  onSplit,
  onDelete,
  onCorrect,
  onClose
}) {
  if (!note) {
    return (
      <aside className="note-inspector inspector-empty" aria-label="Inspector de nota">
        <div className="inspector-empty-state">
          <span className="inspector-empty-icon"><MousePointer2 size={20} /></span>
          <h3>Selecciona una nota</h3>
          <p>Haz clic sobre un bloque del piano roll para editar su afinación, posición y duración.</p>
        </div>
      </aside>
    );
  }

  const frequency = pitchToFrequency(note.pitch, note.cents);
  const maxStart = Math.max(0, totalDuration - note.duration);
  const maxDuration = Math.max(0.4, totalDuration - note.start);
  const centsTone = note.corrected ? "is-corrected" : Math.abs(note.cents) > 10 ? "is-warning" : "is-near";
  const driftAverage = note.drift?.length
    ? note.drift.reduce((sum, value) => sum + value, 0) / note.drift.length
    : null;

  function preview(field, value) {
    onPreview(note.id, { [field]: value });
  }

  function commitStep(field, direction, step) {
    const current = Number(note[field]) || 0;
    const bounds =
      field === "start"
        ? [0, maxStart]
        : field === "duration"
          ? [0.2, maxDuration]
          : [-50, 50];
    const next = Math.min(bounds[1], Math.max(bounds[0], roundTo(current + direction * step, step)));
    onCommit(note.id, { [field]: next });
  }

  return (
    <aside className="note-inspector" aria-label="Inspector de nota">
      <div className="inspector-heading">
        <div>
          <span className="section-kicker">INSPECTOR</span>
          <h3>Nota seleccionada</h3>
        </div>
        <button
          className="icon-button inspector-close"
          onClick={onClose}
          aria-label="Cerrar inspector"
        >
          <X size={15} />
        </button>
      </div>

      <div className="selected-note-card">
        <span className={`note-dot ${note.corrected ? "is-corrected" : ""}`} />
        <div>
          <strong>{note.pitch}</strong>
          <span className={centsTone}>
            {note.corrected
              ? "Afinación centrada"
              : Math.abs(note.cents) > 10
                ? "Requiere ajuste"
                : "Cerca del objetivo"}
          </span>
        </div>
        <span className={`cents-value ${centsTone}`}>
          {formatCents(note.cents)} <small>cents</small>
        </span>
      </div>

      <div className="inspector-summary">
        <div>
          <span>Octava</span>
          <strong className="mono">{pitchToOctave(note.pitch)}</strong>
        </div>
        <div>
          <span>Frecuencia</span>
          <strong className="mono">{formatFrequency(frequency)}</strong>
        </div>
        <div>
          <span>Inicio</span>
          <strong className="mono">{formatTimePrecise(note.start)}</strong>
        </div>
        <div>
          <span>Duración</span>
          <strong className="mono">{note.duration.toFixed(2)} s</strong>
        </div>
      </div>

      <div className="inspector-divider" />

      <div className="inspector-fields">
        <label className="inspector-select">
          <span>Nota / octava</span>
          <select
            className="select-input"
            value={note.pitch}
            onChange={(event) => {
              const pitch = event.target.value;
              const row = pitchRows.indexOf(pitch);
              onSetPitch(note.id, pitch, row >= 0 ? row : note.row);
            }}
          >
            {pitchRows.map((pitch) => (
              <option key={pitch} value={pitch}>{pitch}</option>
            ))}
          </select>
        </label>

        <RangeField
          label="Desviación"
          value={note.cents}
          display={`${formatCents(note.cents)} cents`}
          min={-50}
          max={50}
          step={1}
          unit="cents"
          onChange={(value) => preview("cents", value)}
          onStep={(step) => commitStep("cents", step, 1)}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
        />

        <RangeField
          label="Posición temporal"
          value={note.start}
          display={`${formatTime(note.start)} · ${note.start.toFixed(2)} s`}
          min={0}
          max={maxStart}
          step={0.1}
          unit="segundos"
          onChange={(value) => preview("start", value)}
          onStep={(step) => commitStep("start", step, 0.1)}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
        />

        <RangeField
          label="Duración"
          value={note.duration}
          display={`${note.duration.toFixed(2)} s`}
          min={0.2}
          max={maxDuration}
          step={0.1}
          unit="segundos"
          onChange={(value) => preview("duration", value)}
          onStep={(step) => commitStep("duration", step, 0.1)}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
        />
      </div>

      <div className="inspector-divider" />

      <div className="drift-heading">
        <div>
          <span>Deriva de afinación</span>
          <small>{driftAverage === null ? "Sin datos" : `Media ${formatCents(driftAverage)} cents`}</small>
        </div>
        <span className="tag-soft">cents</span>
      </div>
      <DriftChart drift={note.drift || []} />

      <div className="inspector-actions">
        <button
          type="button"
          className="btn btn-secondary btn-wide"
          onClick={() => onCorrect(note.id)}
        >
          <Crosshair size={14} /> Centrar afinación
        </button>
        <span className="simulation-note">Corrección simulada · no procesa el audio</span>
        <div className="inspector-action-row">
          <button type="button" className="btn btn-ghost" onClick={() => onSplit(note.id)}>
            <Scissors size={14} /> Dividir
          </button>
          <button type="button" className="btn btn-ghost inspector-delete" onClick={() => onDelete(note.id)}>
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </aside>
  );
}
