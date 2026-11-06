import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Music2 } from "lucide-react";
import { seedProjects, useProjects } from "../../../entities/project";
import {
  TIMELINE_SECONDS,
  correctNote,
  deleteNote,
  moveNote,
  noteRepository,
  pitchRows,
  setNotePitch,
  splitNote,
  splitNoteAt
} from "../../../entities/note";
import { useAudioImport } from "../../../features/import-audio";
import { usePlayback } from "../../../features/transport";
import { AUDIO_ACCEPT, slicePeaks } from "../../../shared/lib/audio/audioFiles";
import { audioLibrary } from "../../../shared/lib/audio/audioLibrary";
import { audioBufferToWav, downloadBlob } from "../../../shared/lib/audio/wav";
import { formatTime } from "../../../shared/lib/format";
import { useToast } from "../../../shared/lib/hooks/useToast";
import { Toast } from "../../../shared/ui";
import { StudioTopbar } from "../../../widgets/studio-topbar";
import { ToolRail } from "../../../widgets/tool-rail";
import { WaveformTimeline } from "../../../widgets/waveform-timeline";
import { PianoRoll } from "../../../widgets/piano-roll";
import { NoteInspector } from "../../../widgets/note-inspector";
import { TransportBar } from "../../../widgets/transport-bar";

const TOOL_HINTS = {
  select: "Selecciona una nota para inspeccionarla",
  move: "Arrastra para mover · ↑ ↓ cambia de nota",
  split: "Haz clic sobre una nota para dividirla",
  resize: "Arrastra una nota para ajustar su duración"
};

function loadProjectNotes(projectId) {
  return noteRepository.get(projectId);
}

export function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, setProjects } = useProjects();
  const project =
    projects.find((item) => item.id === projectId) ||
    seedProjects.find((item) => item.id === projectId) ||
    { ...seedProjects[0], id: projectId };

  const [notes, setNotes] = useState(() => loadProjectNotes(projectId));
  const [selectedId, setSelectedId] = useState(() => {
    const loaded = loadProjectNotes(projectId);
    return loaded[3]?.id ?? loaded[0]?.id ?? null;
  });
  const [history, setHistory] = useState({ past: [], future: [] });
  const [saveState, setSaveState] = useState("saved");
  const [tool, setTool] = useState("select");
  const [zoom, setZoom] = useState(1);
  const [abMode, setAbMode] = useState("original");
  const [inspectorOpen, setInspectorOpen] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 981px)").matches
  );
  const [audioAsset, setAudioAsset] = useState(() => audioLibrary.get(projectId));
  const [exporting, setExporting] = useState(false);

  const audioImport = useAudioImport();
  const fileInputRef = useRef(null);
  const notesRef = useRef(notes);
  const historyRef = useRef(history);
  const editSnapshotRef = useRef(null);

  notesRef.current = notes;
  historyRef.current = history;

  const timelineDuration = Math.max(
    16,
    Math.min(audioAsset?.duration || TIMELINE_SECONDS, TIMELINE_SECONDS)
  );
  const visiblePeaks = useMemo(() => {
    if (!audioAsset?.peaks) return null;
    return slicePeaks(audioAsset.peaks, timelineDuration / audioAsset.duration);
  }, [audioAsset, timelineDuration]);

  const playback = usePlayback({ duration: timelineDuration, audioUrl: audioAsset?.url });
  const selectedNote = notes.find((note) => note.id === selectedId) || null;
  const { toast, showToast, dismissToast } = useToast();

  const markDirty = useCallback(() => {
    setSaveState("dirty");
  }, []);

  const applyChange = useCallback((updater) => {
    const current = notesRef.current;
    const next = typeof updater === "function" ? updater(current) : updater;
    if (!next || next === current) return false;

    const nextHistory = {
      past: [...historyRef.current.past.slice(-59), current],
      future: []
    };
    historyRef.current = nextHistory;
    setHistory(nextHistory);
    notesRef.current = next;
    setNotes(next);
    markDirty();
    return true;
  }, [markDirty]);

  const previewNote = useCallback((noteId, patch) => {
    setNotes((current) => {
      const next = moveNote(current, noteId, patch);
      notesRef.current = next;
      return next;
    });
    markDirty();
  }, [markDirty]);

  const beginEdit = useCallback(() => {
    if (!editSnapshotRef.current) editSnapshotRef.current = notesRef.current;
  }, []);

  const endEdit = useCallback(() => {
    const snapshot = editSnapshotRef.current;
    editSnapshotRef.current = null;
    if (!snapshot || snapshot === notesRef.current) return;
    const nextHistory = {
      past: [...historyRef.current.past.slice(-59), snapshot],
      future: []
    };
    historyRef.current = nextHistory;
    setHistory(nextHistory);
  }, []);

  const commitNote = useCallback((noteId, patch) => {
    applyChange((current) => moveNote(current, noteId, patch));
  }, [applyChange]);

  const commitPitch = useCallback((noteId, pitch, row) => {
    applyChange((current) => setNotePitch(current, noteId, pitch, row));
  }, [applyChange]);

  const undo = useCallback(() => {
    const current = historyRef.current;
    if (!current.past.length) return;
    const previous = current.past[current.past.length - 1];
    const nextHistory = {
      past: current.past.slice(0, -1),
      future: [notesRef.current, ...current.future]
    };
    historyRef.current = nextHistory;
    notesRef.current = previous;
    setHistory(nextHistory);
    setNotes(previous);
    setSelectedId((id) => (previous.some((note) => note.id === id) ? id : previous[0]?.id ?? null));
    markDirty();
  }, [markDirty]);

  const redo = useCallback(() => {
    const current = historyRef.current;
    if (!current.future.length) return;
    const next = current.future[0];
    const nextHistory = {
      past: [...current.past, notesRef.current],
      future: current.future.slice(1)
    };
    historyRef.current = nextHistory;
    notesRef.current = next;
    setHistory(nextHistory);
    setNotes(next);
    setSelectedId((id) => (next.some((note) => note.id === id) ? id : next[0]?.id ?? null));
    markDirty();
  }, [markDirty]);

  const saveProject = useCallback(() => {
    setSaveState("saving");
    noteRepository.save(projectId, notesRef.current);
    window.setTimeout(() => {
      setSaveState("saved");
      showToast("Las notas y ajustes de esta sesión se guardaron en el navegador.", {
        title: "Proyecto guardado",
        tone: "success"
      });
    }, 260);
  }, [projectId, showToast]);

  const handleDelete = useCallback((noteId) => {
    const note = notesRef.current.find((item) => item.id === noteId);
    if (!note) return;
    applyChange((current) => deleteNote(current, noteId));
    setSelectedId((id) => (id === noteId ? null : id));
    showToast(`Se eliminó ${note.pitch}. Puedes recuperarla con Deshacer.`, {
      title: "Nota eliminada",
      tone: "warning"
    });
  }, [applyChange, showToast]);

  const handleSplit = useCallback((noteId) => {
    const result = splitNote(notesRef.current, noteId, Date.now());
    if (!result) {
      showToast("La nota es demasiado corta para dividirse (mínimo 0,8 s).", {
        title: "No se pudo dividir",
        tone: "warning"
      });
      return;
    }
    applyChange(result);
    showToast("La nota se dividió en dos segmentos consecutivos.", {
      title: "Nota dividida",
      tone: "success"
    });
  }, [applyChange, showToast]);

  const handleSplitAt = useCallback((noteId, time) => {
    const result = splitNoteAt(notesRef.current, noteId, time, Date.now());
    if (!result) {
      showToast("Haz clic más cerca del centro de la nota para dividirla.", {
        title: "Punto de división no válido",
        tone: "warning"
      });
      return;
    }
    applyChange(result);
    showToast("División aplicada en el punto seleccionado.", {
      title: "Nota dividida",
      tone: "success"
    });
  }, [applyChange, showToast]);

  const handleCorrect = useCallback((noteId) => {
    applyChange((current) => correctNote(current, noteId));
    showToast("La nota se muestra a 0 cents. La corrección del audio es simulada.", {
      title: "Afinación centrada",
      tone: "info"
    });
  }, [applyChange, showToast]);

  const handleSelect = useCallback((noteId) => {
    setSelectedId(noteId);
    if (window.matchMedia?.("(max-width: 980px)").matches) setInspectorOpen(true);
  }, []);

  async function handleAudioFile(file) {
    if (!file) return;
    const decoded = await audioImport.importFile(file);
    if (!decoded) return;

    audioLibrary.register(projectId, decoded);
    setAudioAsset(decoded);
    setProjects((current) =>
      current.map((item) =>
        item.id === projectId
          ? {
              ...item,
              files: Math.max(1, item.files || 0),
              source: decoded.name,
              duration: formatTime(decoded.duration),
              date: "Ahora",
              status: "En edición"
            }
          : item
      )
    );
    showToast("La forma de onda ya está disponible en el editor.", {
      title: "Audio importado",
      tone: "success"
    });
  }

  function handleAbChange(mode) {
    setAbMode(mode);
    showToast(
      mode === "corregido"
        ? "Vista B activa. La corrección de afinación es visual y no procesa el audio."
        : "Vista A activa. Se reproduce la referencia original.",
      { title: mode === "corregido" ? "Comparación B · simulada" : "Referencia original", tone: "info" }
    );
  }

  function handleExport() {
    if (!audioAsset?.audioBuffer) {
      showToast("Importa o graba un audio real para exportar un WAV. La forma de onda de demostración no contiene audio.", {
        title: "Sin audio para exportar",
        tone: "warning",
        duration: 4200
      });
      return;
    }

    setExporting(true);
    window.setTimeout(() => {
      try {
        const wav = audioBufferToWav(audioAsset.audioBuffer);
        const safeName = project.name.replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "") || "dolean";
        downloadBlob(wav, `${safeName}.wav`);
        showToast("Se exportó el audio original en WAV. La corrección de afinación todavía no se aplica a la señal.", {
          title: "WAV exportado",
          tone: "info",
          duration: 4600
        });
      } catch {
        showToast("No fue posible generar el archivo WAV.", {
          title: "Error de exportación",
          tone: "error"
        });
      } finally {
        setExporting(false);
      }
    }, 120);
  }

  useEffect(() => {
    const nextNotes = loadProjectNotes(projectId);
    setNotes(nextNotes);
    notesRef.current = nextNotes;
    setSelectedId(nextNotes[3]?.id ?? nextNotes[0]?.id ?? null);
    setHistory({ past: [], future: [] });
    historyRef.current = { past: [], future: [] };
    editSnapshotRef.current = null;
    setSaveState("saved");
    setAudioAsset(audioLibrary.get(projectId));
    setTool("select");
    setZoom(1);
  }, [projectId]);

  useEffect(() => {
    if (audioImport.status === "error" && audioImport.error) {
      showToast(audioImport.error, {
        title: "Audio no compatible",
        tone: "error",
        duration: 4200
      });
    }
  }, [audioImport.status, audioImport.error, showToast]);

  useEffect(() => {
    function handleShortcut(event) {
      const target = event.target;
      const isField =
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable);

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveProject();
        return;
      }

      if (isField) return;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedId !== null) {
          event.preventDefault();
          handleDelete(selectedId);
        }
        return;
      }

      const shortcutTools = { v: "select", m: "move", s: "split", r: "resize" };
      const shortcutTool = shortcutTools[event.key.toLowerCase()];
      if (shortcutTool) setTool(shortcutTool);
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [handleDelete, redo, saveProject, selectedId, undo]);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <div className={`editor-shell ${inspectorOpen ? "inspector-open" : "inspector-closed"}`}>
      <StudioTopbar
        project={project}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onBack={() => navigate("/app/projects")}
        onSettings={() => navigate("/app/settings")}
        onAnalysis={() => navigate(`/app/analysis/${project.id}`)}
        onSave={saveProject}
        onToggleInspector={() => setInspectorOpen((value) => !value)}
        inspectorOpen={inspectorOpen}
        saveState={saveState}
      />

      <div className="editor-layout">
        <ToolRail
          tool={tool}
          onToolChange={setTool}
          zoom={zoom}
          onZoomIn={() => setZoom((value) => Math.min(2.4, value + 0.2))}
          onZoomOut={() => setZoom((value) => Math.max(1, value - 0.2))}
          onZoomReset={() => setZoom(1)}
        />

        <main className="editor-center" aria-label="Editor de piano roll">
          <section className="timeline-panel">
            <div className="timeline-panel-head">
              <div className="timeline-title">
                <span className="timeline-title-icon"><Music2 size={15} /></span>
                <div>
                  <span className="section-kicker">EDITOR DE AFINACIÓN</span>
                  <h2>Piano roll</h2>
                </div>
              </div>

              <div className="piano-legend" aria-label="Leyenda del piano roll">
                <span><i className="legend-note" /> Nota</span>
                <span><i className="legend-selected" /> Seleccionada</span>
                <span><i className="legend-corrected" /> Corregida</span>
              </div>

              <span className="tool-hint">{TOOL_HINTS[tool]}</span>
            </div>

            <div className="timeline-scroll" tabIndex={-1}>
              <div className="timeline-stage" style={{ width: `${zoom * 100}%` }}>
                <WaveformTimeline
                  peaks={visiblePeaks}
                  duration={timelineDuration}
                  currentTime={playback.currentTime}
                  abMode={abMode}
                  fileName={audioAsset?.name}
                  hasAudio={Boolean(audioAsset)}
                  importing={audioImport.status === "loading"}
                  onSeek={playback.seek}
                  onImport={() => fileInputRef.current?.click()}
                />
                <PianoRoll
                  notes={notes}
                  pitchRows={pitchRows}
                  selectedId={selectedId}
                  tool={tool}
                  totalDuration={timelineDuration}
                  currentTime={playback.currentTime}
                  onSelect={handleSelect}
                  onClearSelection={() => setSelectedId(null)}
                  onSeek={playback.seek}
                  onEditStart={beginEdit}
                  onEditEnd={endEdit}
                  onPreviewNote={previewNote}
                  onCommitNote={commitNote}
                  onSplitNoteAt={handleSplitAt}
                  onDeleteNote={handleDelete}
                />
              </div>
            </div>
          </section>

          <TransportBar
            duration={timelineDuration}
            currentTime={playback.currentTime}
            isPlaying={playback.isPlaying}
            abMode={abMode}
            volume={playback.volume}
            exporting={exporting}
            onTogglePlay={playback.toggle}
            onStop={playback.stop}
            onGoStart={() => playback.seek(0)}
            onGoEnd={() => playback.seek(timelineDuration)}
            onSeek={playback.seek}
            onAbChange={handleAbChange}
            onVolume={playback.setVolume}
            onExport={handleExport}
          />
        </main>

        {inspectorOpen && (
          <NoteInspector
            note={selectedNote}
            pitchRows={pitchRows}
            totalDuration={timelineDuration}
            onPreview={previewNote}
            onCommit={commitNote}
            onEditStart={beginEdit}
            onEditEnd={endEdit}
            onSetPitch={commitPitch}
            onSplit={handleSplit}
            onDelete={handleDelete}
            onCorrect={handleCorrect}
            onClose={() => setInspectorOpen(false)}
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={AUDIO_ACCEPT}
        className="sr-only"
        aria-label="Seleccionar archivo de audio para el editor"
        onChange={(event) => {
          handleAudioFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <Toast {...(toast || {})} onClose={dismissToast} />
    </div>
  );
}
