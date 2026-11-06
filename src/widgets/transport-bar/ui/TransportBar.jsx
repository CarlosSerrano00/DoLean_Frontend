import {
  Download,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Square,
  Volume1,
  Volume2,
  VolumeX
} from "lucide-react";
import { formatTime, formatTimePrecise } from "../../../shared/lib/format";
import { Spinner } from "../../../shared/ui";

export function TransportBar({
  duration,
  currentTime,
  isPlaying,
  abMode,
  volume,
  exporting,
  onTogglePlay,
  onStop,
  onGoStart,
  onGoEnd,
  onSeek,
  onAbChange,
  onVolume,
  onExport
}) {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <footer className="transport-bar" aria-label="Barra de transporte">
      <div className="transport-scrub">
        <span className="transport-time mono" aria-label="Tiempo actual">{formatTimePrecise(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={Math.min(currentTime, duration)}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Posición de reproducción"
          style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
        <span className="transport-time is-muted mono" aria-label="Duración total">{formatTime(duration)}</span>
      </div>

      <div className="transport-main">
        <div className="transport-controls" role="group" aria-label="Controles de reproducción">
          <button
            type="button"
            className="transport-button ghost"
            onClick={onGoStart}
            aria-label="Ir al inicio"
            title="Ir al inicio"
          >
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            className={`play-button ${isPlaying ? "is-playing" : ""}`}
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button
            type="button"
            className="transport-button ghost"
            onClick={onStop}
            aria-label="Detener"
            title="Detener"
          >
            <Square size={14} fill="currentColor" />
          </button>
          <button
            type="button"
            className="transport-button ghost"
            onClick={onGoEnd}
            aria-label="Ir al final"
            title="Ir al final"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div className="transport-readout">
          <strong className="mono">{formatTime(currentTime)}</strong>
          <span className="mono">/ {formatTime(duration)}</span>
          <span className="transport-fragment">Fragmento de edición</span>
        </div>

        <div className="ab-switch" role="group" aria-label="Comparación A/B">
          <button
            type="button"
            className={abMode === "original" ? "selected" : ""}
            onClick={() => onAbChange("original")}
            aria-pressed={abMode === "original"}
            title="Escuchar la referencia original"
          >
            A · Original
          </button>
          <button
            type="button"
            className={abMode === "corregido" ? "selected" : ""}
            onClick={() => onAbChange("corregido")}
            aria-pressed={abMode === "corregido"}
            title="Vista de corrección simulada: el audio no se procesa"
          >
            B · Corregido
          </button>
          <span className="ab-note">Simulado</span>
        </div>

        <div className="volume-control">
          <VolumeIcon size={15} aria-hidden="true" />
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(event) => onVolume(Number(event.target.value) / 100)}
            aria-label="Volumen"
            style={{ "--volume": `${Math.round(volume * 100)}%` }}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm export-button"
          onClick={onExport}
          disabled={exporting}
          title="Exporta el audio original cargado, sin corrección de afinación"
        >
          {exporting ? <Spinner label="Exportando" /> : <Download size={14} />}
          Exportar WAV
        </button>
      </div>
    </footer>
  );
}
