import { Clock3, MoreHorizontal, Music2 } from "lucide-react";

export function WaveArt({ small = false }) {
  const bars = Array.from({ length: small ? 36 : 70 }, (_, i) => 10 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.19)) * (small ? 40 : 70));
  return <div className={`wave-art ${small ? "wave-art-small" : ""}`}>{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>;
}

export function ProjectCard({ project, onOpen }) {
  return (
    <button className="project-card" onClick={onOpen}>
      <div className="project-thumb"><WaveArt small /><div className="project-thumb-icon"><Music2 size={27} /></div><span className={`status-pill ${project.status === "Listo" ? "status-ready" : "status-edit"}`}>{project.status}</span></div>
      <div className="project-card-body"><div className="project-title-row"><strong>{project.name}</strong><MoreHorizontal size={17} /></div><div className="project-meta"><span><Clock3 size={13} /> {project.date}</span><span>{project.files} {project.files === 1 ? "archivo" : "archivos"}</span></div></div>
    </button>
  );
}
