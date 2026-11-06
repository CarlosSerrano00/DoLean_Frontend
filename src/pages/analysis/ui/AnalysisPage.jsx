import { Activity, CheckCircle2, ChevronRight, Clock3, Music2, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { seedProjects, useProjects } from "../../../entities/project";

export function AnalysisPage() {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const project = projects.find(p => p.id === projectId) || seedProjects[0];
  const navigate = useNavigate();
  return (
    <section className="page-section">
      <div className="page-title-row"><div><span className="section-kicker">RESULTADOS DEL PROYECTO</span><h1>Análisis de afinación</h1><p>{project.name} · Resumen visual de la grabación.</p></div><button className="btn btn-outline" onClick={() => navigate(`/app/editor/${project.id}`)}><Pencil size={15} /> Abrir editor</button></div>
      <div className="analysis-status"><div className="status-check"><CheckCircle2 size={19} /></div><div><strong>Análisis de demostración</strong><span>Los valores son ilustrativos; el análisis real se conectará al backend.</span></div><span className="status-pill status-ready">Vista previa</span></div>
      <div className="metric-grid"><Metric label="Notas detectadas" value="182" note="En el fragmento de ejemplo" icon={Music2} /><Metric label="Desviación media" value="±12.5" suffix="cents" note="Respecto a la afinación objetivo" icon={Activity} /><Metric label="Duración" value={project.duration || "03:20"} note="Duración del proyecto" icon={Clock3} /></div>
      <div className="analysis-grid">
        <div className="panel-card chart-card"><div className="panel-heading"><div><h3>Trayectoria de afinación</h3><p>Variación estimada a lo largo del tiempo</p></div><span className="tag-soft">Cents</span></div><div className="chart-area"><div className="chart-y-labels"><span>+40</span><span>+20</span><span>0</span><span>-20</span><span>-40</span></div><svg viewBox="0 0 700 230" preserveAspectRatio="none" role="img" aria-label="Gráfico ilustrativo de trayectoria de afinación"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8055f6" stopOpacity=".3" /><stop offset="100%" stopColor="#8055f6" stopOpacity="0" /></linearGradient></defs>{[35,80,125,170,215].map(y => <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#303750" strokeDasharray="4 6" />)}<path d="M0 125 C25 125 35 65 70 86 S110 146 145 113 S190 48 220 82 S260 155 300 121 S350 65 385 95 S425 145 460 108 S510 55 540 88 S590 135 620 93 S665 55 700 74 L700 230 L0 230 Z" fill="url(#chartFill)" /><path d="M0 125 C25 125 35 65 70 86 S110 146 145 113 S190 48 220 82 S260 155 300 121 S350 65 385 95 S425 145 460 108 S510 55 540 88 S590 135 620 93 S665 55 700 74" fill="none" stroke="#966cff" strokeWidth="3.5" strokeLinecap="round" /></svg></div><div className="chart-x-labels"><span>0:00</span><span>0:30</span><span>1:00</span><span>1:30</span><span>2:00</span><span>2:30</span><span>3:00</span></div></div>
        <div className="panel-card analysis-summary"><div className="panel-heading"><div><h3>Resumen del análisis</h3><p>Indicadores del audio</p></div><Activity size={18} /></div><div className="summary-row"><span>Referencia tonal</span><strong>A4 · 440 Hz</strong></div><div className="summary-row"><span>Desviación promedio</span><strong>±12.5 cents</strong></div><div className="summary-row"><span>Notas detectadas</span><strong>182</strong></div><div className="summary-row"><span>Estado</span><strong className="text-success"><CheckCircle2 size={14} /> Completado</strong></div><button className="btn btn-primary btn-wide" onClick={() => navigate(`/app/editor/${project.id}`)}>Continuar en el editor <ChevronRight size={16} /></button></div>
      </div>
    </section>
  );
}

export function Metric({ label, value, suffix, note, icon: Icon }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={17} /></span></div><div className="metric-value">{value} <small>{suffix}</small></div><p>{note}</p></div>;
}
