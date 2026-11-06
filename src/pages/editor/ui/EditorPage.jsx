import { useState } from "react";
import { Activity, ArrowLeft, Check, ChevronRight, Download, Music2, Pause, Pencil, Play, RotateCcw, Scissors, Square, Volume2, Waves, ZoomIn, ZoomOut } from "lucide-react";
import { useParams } from "react-router-dom";
import { seedProjects, useProjects } from "../../../entities/project";
import { initialNotes, pitchRows, splitNote as splitNoteOperation, updateNote } from "../../../entities/note";
import { Toast } from "../../../shared/ui";

export function EditorPage() {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const project = projects.find(p => p.id === projectId) || seedProjects[0];
  const [notes, setNotes] = useState(initialNotes);
  const [selectedId, setSelectedId] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(38);
  const [abMode, setAbMode] = useState("corregido");
  const [toast, setToast] = useState("");
  const [zoom, setZoom] = useState(1);
  const selected = notes.find(n => n.id === selectedId) || notes[0];

  function updateSelected(key, value) {
    setNotes(old => updateNote(old, selectedId, key, value));
  }
  function splitNote() {
    const updatedNotes = splitNoteOperation(notes, selectedId, Date.now());
    if (!updatedNotes) return;
    setNotes(updatedNotes);
    setToast("Nota dividida en dos segmentos.");
    window.setTimeout(() => setToast(""), 2500);
  }

  return (
    <section className="editor-page">
      <div className="editor-header">
        <div><div className="breadcrumbs"><span>Mis proyectos</span><ChevronRight size={14} /><strong>{project.name}</strong></div><h1>{project.name}</h1><span className="saved-label"><span className="live-dot" /> Cambios locales del prototipo</span></div>
        <div className="editor-header-actions"><button className="btn btn-outline" onClick={() => { setToast("Cambios guardados localmente."); window.setTimeout(() => setToast(""), 2500); }}><Check size={16} /> Guardar cambios</button><button className="btn btn-primary" onClick={() => { setToast("La exportación WAV estará disponible al integrar el motor de procesamiento."); window.setTimeout(() => setToast(""), 3000); }}><Download size={16} /> Exportar WAV</button></div>
      </div>
      <div className="editor-workspace">
        <div className="editor-toolbar">
          <button className="tool-button active" title="Seleccionar"><span>↖</span></button><button className="tool-button" title="Editar"><Pencil size={16} /></button><button className="tool-button" title="Dividir nota" onClick={splitNote}><Scissors size={16} /></button><span className="tool-separator" /><button className="tool-button" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} title="Acercar"><ZoomIn size={16} /></button><button className="tool-button" onClick={() => setZoom(z => Math.max(.7, z - .1))} title="Alejar"><ZoomOut size={16} /></button><span className="zoom-label">{Math.round(zoom * 100)}%</span><div className="toolbar-spacer" /><span className="editor-mode"><Activity size={14} /> Afinación monofónica</span>
        </div>
        <div className="wave-panel">
          <div className="wave-panel-top"><span><Waves size={15} /> Forma de onda</span><span>00:00 <i /> 03:20</span></div>
          <div className="wave-timeline"><span>0:00</span><span>0:30</span><span>1:00</span><span>1:30</span><span>2:00</span><span>2:30</span><span>3:00</span></div>
          <div className="waveform"><div className="waveform-fill" />{Array.from({ length: 116 }, (_, i) => <i key={i} style={{ height: `${12 + Math.abs(Math.sin(i * .41) * Math.cos(i * .11)) * 74 + (i % 9) * 1.4}%` }} />)}<div className="playhead" style={{ left: `${progress}%` }} /></div>
        </div>
        <div className="piano-toolbar"><span className="piano-title"><Music2 size={15} /> Editor de notas</span><div className="piano-legend"><span><i className="legend-note" /> Nota detectada</span><span><i className="legend-selected" /> Seleccionada</span></div></div>
        <div className="piano-editor">
          <div className="piano-labels">{pitchRows.map((p, i) => <div key={p} className={p.includes("#") ? "black-key-label" : ""}>{p}</div>)}</div>
          <div className="piano-grid-wrap">
            <div className="piano-time-labels">{Array.from({ length: 8 }, (_, i) => <span key={i}>{`${i * 0.4}:00`}</span>)}</div>
            <div className="piano-grid" style={{ transform: `scaleX(${zoom})`, transformOrigin: "left center" }}>
              {pitchRows.map((p, i) => <div key={p} className={`piano-row ${i % 2 === 0 ? "piano-row-alt" : ""}`} />)}
              {notes.map(note => <button key={note.id} className={`note-block ${selectedId === note.id ? "note-selected" : ""}`} style={{ top: `${note.row / pitchRows.length * 100}%`, left: `${note.start / 16 * 100}%`, width: `${note.duration / 16 * 100}%` }} onClick={() => setSelectedId(note.id)} title={`${note.pitch}: ${note.cents > 0 ? "+" : ""}${note.cents} cents`}><span>{note.pitch}</span></button>)}
              <div className="piano-cursor" style={{ left: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="transport-bar">
          <div className="transport-controls"><button className="transport-icon" onClick={() => setProgress(0)} title="Volver al inicio"><ArrowLeft size={16} /></button><button className="play-button" onClick={() => setPlaying(v => !v)} aria-label={playing ? "Pausar" : "Reproducir"}>{playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}</button><button className="transport-icon" onClick={() => setProgress(100)} title="Ir al final"><Square size={15} /></button><strong>{playing ? "Reproduciendo" : "01:23"} <span>/ 03:20</span></strong></div>
          <input className="progress-range" type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} aria-label="Progreso de reproducción" />
          <div className="transport-right"><div className="ab-toggle"><button className={abMode === "original" ? "selected" : ""} onClick={() => setAbMode("original")}>Original</button><button className={abMode === "corregido" ? "selected" : ""} onClick={() => setAbMode("corregido")}>Corregido</button></div><Volume2 size={17} /><input className="volume-range" type="range" min="0" max="100" defaultValue="72" aria-label="Volumen" /></div>
        </div>
      </div>
      <aside className="note-inspector">
        <div className="inspector-heading"><div><span className="section-kicker">PROPIEDADES</span><h3>Nota seleccionada</h3></div><span className="inspector-note">{selected?.pitch || "—"}</span></div>
        <div className="selected-note-card"><span className="note-dot" /><div><strong>{selected?.pitch || "Nota"}</strong><span>Nota detectada</span></div><span className="cents-value">{selected?.cents > 0 ? "+" : ""}{selected?.cents} <small>cents</small></span></div>
        <label className="control-label"><span>Afinación <strong>{selected?.cents > 0 ? "+" : ""}{selected?.cents} cents</strong></span><input type="range" min="-50" max="50" value={selected?.cents || 0} onChange={e => updateSelected("cents", e.target.value)} /></label>
        <label className="control-label"><span>Posición temporal <strong>{selected?.start.toFixed(1)} s</strong></span><input type="range" min="0" max="14" step=".1" value={selected?.start || 0} onChange={e => updateSelected("start", e.target.value)} /></label>
        <label className="control-label"><span>Duración <strong>{selected?.duration.toFixed(1)} s</strong></span><input type="range" min=".3" max="4" step=".1" value={selected?.duration || 1} onChange={e => updateSelected("duration", e.target.value)} /></label>
        <div className="inspector-divider" />
        <div className="inspector-info"><span>Corrección de deriva</span><span className="tag-soft">Manual</span></div>
        <p className="inspector-help">Ajusta la afinación y el tiempo de la nota seleccionada. Los cambios son visuales y locales en este prototipo.</p>
        <button className="btn btn-primary btn-wide" onClick={() => { setToast("Ajustes visuales aplicados."); window.setTimeout(() => setToast(""), 2500); }}><Check size={16} /> Aplicar cambios</button>
        <button className="btn btn-ghost btn-wide" onClick={() => setNotes(initialNotes)}><RotateCcw size={15} /> Restablecer notas</button>
        <button className="split-action" onClick={splitNote}><Scissors size={15} /> Dividir nota seleccionada</button>
      </aside>
      {toast && <Toast message={toast} />}
    </section>
  );
}
