import { useEffect, useRef, useState } from "react";
import {
  Check,
  FileAudio,
  Mic,
  Square,
  Trash2,
  Upload,
  AudioWaveform
} from "lucide-react";
import { Modal, Spinner } from "../../../shared/ui";
import { AUDIO_ACCEPT } from "../../../shared/lib/audio/audioFiles";
import { audioLibrary } from "../../../shared/lib/audio/audioLibrary";
import { formatFileSize, formatTime } from "../../../shared/lib/format";
import { createLocalProject } from "../model/createLocalProject";
import { useAudioImport } from "../../import-audio";
import { useAudioRecorder } from "../../record-audio";

export function CreateProjectModal({ onClose, onCreated, initialIntent = "create" }) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState(initialIntent === "record" ? "record" : "import");
  const [dragging, setDragging] = useState(false);
  const audio = useAudioImport();
  const recorder = useAudioRecorder();
  const recordedFileRef = useRef(null);
  const assetRef = useRef(audio.asset);
  const committedRef = useRef(false);
  const fileInputRef = useRef(null);

  assetRef.current = audio.asset;

  useEffect(() => () => {
    if (!committedRef.current && assetRef.current?.url) {
      URL.revokeObjectURL(assetRef.current.url);
    }
  }, []);

  useEffect(() => {
    if (!recorder.file || recorder.file === recordedFileRef.current) return;
    recordedFileRef.current = recorder.file;
    audio.importFile(recorder.file);
  }, [audio, recorder.file]);

  function handleFile(file) {
    if (!file) return;
    recorder.reset();
    setMode("import");
    audio.importFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function startRecording() {
    audio.clearAsset();
    recordedFileRef.current = null;
    setMode("record");
    recorder.start();
  }

  function clearAudio() {
    audio.clearAsset();
    recorder.reset();
    recordedFileRef.current = null;
  }

  function submit(event) {
    event.preventDefault();
    if (audio.status === "loading") return;

    const project = createLocalProject({ name, file: audio.asset?.file });
    const enrichedProject = audio.asset
      ? {
          ...project,
          files: 1,
          source: audio.asset.name,
          duration: formatTime(Math.min(audio.asset.duration, 20))
        }
      : project;

    if (audio.asset) {
      audioLibrary.register(enrichedProject.id, audio.asset);
      committedRef.current = true;
    }

    onCreated(enrichedProject, audio.asset);
  }

  const error = audio.error || recorder.error;

  return (
    <Modal
      title="Nuevo proyecto"
      description="Crea la sesión y añade una toma para empezar a editar."
      onClose={onClose}
      wide
    >
      <form className="form-stack create-project-form" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Nombre del proyecto</span>
          <input
            className="plain-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Voz principal — toma 2"
            maxLength={60}
            autoFocus
          />
        </label>

        <div className="source-header">
          <span className="field-label">Origen del audio</span>
          <div className="source-tabs" role="tablist" aria-label="Origen del audio">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "import"}
              className={mode === "import" ? "active" : ""}
              onClick={() => setMode("import")}
            >
              <Upload size={13} /> Importar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "record"}
              className={mode === "record" ? "active" : ""}
              onClick={() => setMode("record")}
            >
              <Mic size={13} /> Grabar
            </button>
          </div>
        </div>

        {mode === "import" ? (
          <div
            className={`dropzone ${dragging ? "is-dragging" : ""} ${audio.asset ? "has-file" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={AUDIO_ACCEPT}
              className="sr-only"
              aria-label="Seleccionar archivo de audio para el proyecto"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            {audio.status === "loading" && (
              <div className="dropzone-state">
                <Spinner label="Decodificando audio" />
                <strong>Decodificando audio…</strong>
                <span>Leyendo la forma de onda en el navegador.</span>
              </div>
            )}

            {audio.asset && audio.status === "ready" && (
              <div className="audio-file-card">
                <span className="audio-file-icon"><FileAudio size={19} /></span>
                <span className="audio-file-copy">
                  <strong>{audio.asset.name}</strong>
                  <span className="mono">
                    {formatFileSize(audio.asset.size)} · {formatTime(audio.asset.duration)} ·{" "}
                    {audio.asset.channels === 1 ? "mono" : "estéreo"}
                  </span>
                </span>
                <button
                  type="button"
                  className="icon-button"
                  onClick={clearAudio}
                  aria-label="Quitar archivo de audio"
                  data-tooltip="Quitar archivo"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}

            {!audio.asset && audio.status !== "loading" && (
              <div className="dropzone-state">
                <span className="dropzone-icon"><AudioWaveform size={24} /></span>
                <strong>Arrastra un audio o selecciónalo</strong>
                <span>WAV, MP3, M4A, AAC, OGG, FLAC o WebM · máx. 50 MB</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={13} /> Elegir archivo
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`record-panel ${recorder.isRecording ? "is-recording" : ""}`}>
            <div className="record-visual">
              <span className="record-orb"><Mic size={24} /></span>
              <div>
                <strong>
                  {recorder.isRecording
                    ? "Capturando micrófono"
                    : recorder.isProcessing
                      ? "Preparando la toma…"
                      : recorder.status === "ready"
                        ? "Toma lista"
                        : "Grabación desde el navegador"}
                </strong>
                <span>
                  {recorder.isRecording
                    ? "Canta o toca cerca del micrófono. Puedes detener cuando quieras."
                    : "La captura se procesa en este dispositivo y no se sube a ningún servidor."}
                </span>
              </div>
            </div>

            <div className="record-readout" aria-live="polite">
              <span className="record-dot" aria-hidden="true" />
              <strong className="mono">{formatTime(recorder.seconds)}</strong>
              <span>
                {recorder.isRecording
                  ? "REC"
                  : recorder.status === "ready"
                    ? "COMPLETADO"
                    : recorder.isRequesting
                      ? "SOLICITANDO PERMISO"
                      : "EN ESPERA"}
              </span>
            </div>

            <div className="record-actions">
              {!recorder.isRecording && !recorder.isRequesting && !recorder.isProcessing && (
                <button type="button" className="btn btn-primary" onClick={startRecording}>
                  <Mic size={14} /> {recorder.status === "ready" ? "Grabar otra toma" : "Iniciar grabación"}
                </button>
              )}
              {recorder.isRecording && (
                <button type="button" className="btn btn-danger" onClick={recorder.stop}>
                  <Square size={13} fill="currentColor" /> Detener captura
                </button>
              )}
              {(recorder.isRequesting || recorder.isProcessing) && (
                <span className="record-loading"><Spinner label="Procesando audio" /> Un momento…</span>
              )}
              {(recorder.isRecording || recorder.status === "ready") && (
                <button type="button" className="btn btn-ghost" onClick={clearAudio}>
                  Cancelar
                </button>
              )}
            </div>

            {recorder.status === "ready" && audio.status === "loading" && (
              <div className="record-loading">
                <Spinner label="Preparando toma" /> Preparando la forma de onda…
              </div>
            )}

            {recorder.status === "ready" && audio.asset && (
              <div className="record-result">
                <Check size={14} />
                <span>
                  <strong>{audio.asset.name}</strong>
                  <small className="mono">
                    {formatTime(audio.asset.duration)} · {formatFileSize(audio.asset.size)}
                  </small>
                </span>
              </div>
            )}
          </div>
        )}

        {error && <div className="form-error" role="alert">{error}</div>}

        <p className="helper-text">
          El audio se mantiene en memoria durante esta sesión del navegador. El análisis y la
          corrección reales se conectarán al backend.
        </p>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={audio.status === "loading" || recorder.isRecording || recorder.isRequesting}
          >
            Crear y abrir editor
          </button>
        </div>
      </form>
    </Modal>
  );
}
