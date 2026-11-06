import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FolderOpen,
  Music2,
  Pencil
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { initialNotes, pitchToFrequency } from "../../../entities/note";
import { seedProjects, useProjects } from "../../../entities/project";
import { formatCents, formatFrequency, formatTimePrecise } from "../../../shared/lib/format";

export function AnalysisPage() {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const project =
    projects.find((item) => item.id === projectId) ||
    seedProjects.find((item) => item.id === projectId) ||
    seedProjects[0];
  const navigate = useNavigate();

  const averageDeviation =
    initialNotes.reduce((sum, note) => sum + Math.abs(note.cents), 0) / initialNotes.length;
  const averageFrequency =
    initialNotes.reduce((sum, note) => sum + pitchToFrequency(note.pitch, note.cents), 0) /
    initialNotes.length;
  const cleanNotes = initialNotes.filter((note) => Math.abs(note.cents) <= 10).length;

  return (
    <section className="page-section">
      <div className="page-title-row">
        <div>
          <span className="section-kicker">RESULTADOS DEL PROYECTO</span>
          <h1>Análisis de afinación</h1>
          <p>{project.name} · Resumen del fragmento de demostración.</p>
        </div>
        <div className="page-title-actions">
          <button className="btn btn-ghost" onClick={() => navigate("/app/projects")}>
            <FolderOpen size={15} /> Proyectos
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/app/editor/${project.id}`)}>
            <Pencil size={15} /> Abrir editor
          </button>
        </div>
      </div>

      <div className="analysis-status">
        <div className="status-check"><Activity size={18} /></div>
        <div>
          <strong>Análisis de demostración</strong>
          <span>
            Estas métricas se calculan sobre las notas de ejemplo del editor. El análisis real
            del audio se conectará al backend.
          </span>
        </div>
        <span className="status-pill status-edit">Datos simulados</span>
      </div>

      <div className="metric-grid">
        <Metric
          label="Notas en el fragmento"
          value={String(initialNotes.length)}
          note="Notas de ejemplo del piano roll"
          icon={Music2}
        />
        <Metric
          label="Desviación media"
          value={`±${averageDeviation.toFixed(1)}`}
          suffix="cents"
          note="Respecto a la afinación objetivo"
          icon={Activity}
        />
        <Metric
          label="Frecuencia media"
          value={averageFrequency.toFixed(1)}
          suffix="Hz"
          note="Calculada desde la altura y los cents"
          icon={Music2}
        />
        <Metric
          label="Ventana de edición"
          value="00:20"
          note="Fragmento visible en el editor"
          icon={Clock3}
        />
      </div>

      <div className="analysis-grid">
        <div className="panel-card chart-card">
          <div className="panel-heading">
            <div>
              <h2>Trayectoria de afinación</h2>
              <p>Variación ilustrativa a lo largo del fragmento</p>
            </div>
            <span className="tag-soft">Cents</span>
          </div>
          <div className="chart-area">
            <div className="chart-y-labels" aria-hidden="true">
              <span>+40</span><span>+20</span><span>0</span><span>−20</span><span>−40</span>
            </div>
            <svg viewBox="0 0 700 230" preserveAspectRatio="none" role="img" aria-label="Gráfico ilustrativo de trayectoria de afinación">
              <defs>
                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8174f8" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#8174f8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[35, 80, 125, 170, 215].map((y) => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} className="chart-gridline" />
              ))}
              <path
                d="M0 125 C25 125 35 65 70 86 S110 146 145 113 S190 48 220 82 S260 155 300 121 S350 65 385 95 S425 145 460 108 S510 55 540 88 S590 135 620 93 S665 55 700 74 L700 230 L0 230 Z"
                fill="url(#chartFill)"
              />
              <path
                d="M0 125 C25 125 35 65 70 86 S110 146 145 113 S190 48 220 82 S260 155 300 121 S350 65 385 95 S425 145 460 108 S510 55 540 88 S590 135 620 93 S665 55 700 74"
                className="chart-line"
              />
              <line x1="0" y1="125" x2="700" y2="125" className="chart-midline" />
            </svg>
          </div>
          <div className="chart-x-labels" aria-hidden="true">
            <span>0:00</span><span>0:04</span><span>0:08</span><span>0:12</span><span>0:16</span><span>0:20</span>
          </div>
        </div>

        <div className="panel-card analysis-summary">
          <div className="panel-heading">
            <div>
              <h2>Resumen</h2>
              <p>Indicadores del fragmento</p>
            </div>
            <Activity size={17} />
          </div>
          <div className="summary-row"><span>Referencia tonal</span><strong className="mono">A4 · 440 Hz</strong></div>
          <div className="summary-row"><span>Desviación promedio</span><strong className="mono">±{averageDeviation.toFixed(1)} cents</strong></div>
          <div className="summary-row"><span>Notas dentro de ±10 cents</span><strong className="mono">{cleanNotes} / {initialNotes.length}</strong></div>
          <div className="summary-row"><span>Origen de datos</span><strong className="text-warning">Ejemplo local</strong></div>
          <div className="summary-row"><span>Estado del motor</span><strong>No conectado</strong></div>
          <button className="btn btn-primary btn-wide" onClick={() => navigate(`/app/editor/${project.id}`)}>
            Continuar en el editor <ChevronRight size={16} />
          </button>
          <p className="helper-text">
            No se ha procesado audio real. El objetivo de esta vista es validar la lectura de
            resultados y la navegación hacia el editor.
          </p>
        </div>
      </div>

      <div className="panel-card note-table-card">
        <div className="panel-heading">
          <div>
            <h2>Notas del fragmento</h2>
            <p>Valores locales usados por el piano roll</p>
          </div>
          <span className="tag-soft">{initialNotes.length} notas</span>
        </div>
        <div className="table-scroll">
          <table className="note-table">
            <thead>
              <tr>
                <th scope="col">Nota</th>
                <th scope="col">Inicio</th>
                <th scope="col">Duración</th>
                <th scope="col">Frecuencia</th>
                <th scope="col">Desviación</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {initialNotes.map((note) => {
                const inTune = Math.abs(note.cents) <= 10;
                return (
                  <tr key={note.id}>
                    <td><strong>{note.pitch}</strong></td>
                    <td className="mono">{formatTimePrecise(note.start)}</td>
                    <td className="mono">{note.duration.toFixed(2)} s</td>
                    <td className="mono">{formatFrequency(pitchToFrequency(note.pitch, note.cents))}</td>
                    <td className={`mono ${inTune ? "text-success" : "text-warning"}`}>
                      {formatCents(note.cents)} cents
                    </td>
                    <td>
                      <span className={`mini-status ${inTune ? "is-ok" : "is-attention"}`}>
                        {inTune ? <CheckCircle2 size={12} /> : <Activity size={12} />}
                        {inTune ? "Aceptable" : "Revisar"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, suffix, note, icon: Icon }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <span className="metric-icon"><Icon size={16} /></span>
      </div>
      <div className="metric-value">{value} {suffix && <small>{suffix}</small>}</div>
      <p>{note}</p>
    </div>
  );
}
