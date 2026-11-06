import { Upload, Waves } from "lucide-react";
import { buildDemoPeaks } from "../../../shared/lib/audio/waveform";
import { formatTime } from "../../../shared/lib/format";
import { Spinner } from "../../../shared/ui";

export function WaveformTimeline({
  peaks,
  duration,
  currentTime,
  abMode,
  fileName,
  hasAudio,
  importing,
  error,
  onSeek,
  onImport
}) {
  const bars = peaks?.length ? peaks : buildDemoPeaks(220);
  const percent = duration ? (currentTime / duration) * 100 : 0;

  function seekFromEvent(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  }

  return (
    <div className={`waveform-panel ${abMode === "corregido" ? "is-corrected" : ""}`}>
      <div className="waveform-head">
        <div className="waveform-heading">
          <span className="waveform-title"><Waves size={14} /> Forma de onda</span>
          <span className={`waveform-file ${hasAudio ? "has-audio" : ""}`}>
            {fileName || "Demostración · voz monofónica"}
          </span>
        </div>
        <div className="waveform-head-actions">
          <span className={`waveform-ab ${abMode === "corregido" ? "is-b" : ""}`}>
            {abMode === "corregido" ? "B" : "A"}
          </span>
          <span className="mono waveform-duration">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onImport}
            disabled={importing}
            title="Importar un archivo de audio"
          >
            {importing ? <Spinner label="Importando audio" /> : <Upload size={13} />}
            Importar audio
          </button>
        </div>
      </div>

      <div
        className="waveform-track"
        onPointerDown={seekFromEvent}
        role="slider"
        aria-label="Forma de onda y posición de reproducción"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onSeek(Math.min(duration, currentTime + 0.5));
          if (event.key === "ArrowLeft") onSeek(Math.max(0, currentTime - 0.5));
        }}
      >
        <div className="waveform-bars" aria-hidden="true">
          {bars.map((peak, index) => (
            <i key={index} style={{ height: `${Math.max(4, peak * 100)}%` }} />
          ))}
        </div>
        <span className="waveform-center" aria-hidden="true" />
        <span className="waveform-playhead" style={{ left: `${percent}%` }} aria-hidden="true">
          <i />
        </span>
      </div>

      <div className="waveform-foot">
        <span className="mono">{formatTime(0)}</span>
        <span className="waveform-hint">
          {hasAudio ? "Audio cargado en este navegador" : "Datos ilustrativos · sin audio real"}
        </span>
        <span className="mono">{formatTime(duration)}</span>
      </div>

      {error && <div className="form-error waveform-error" role="alert">{error}</div>}
    </div>
  );
}
