import { X } from "lucide-react";

export function Modal({ title, children, onClose }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal-card" onMouseDown={e => e.stopPropagation()}><div className="modal-heading"><h3>{title}</h3><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button></div>{children}</section></div>;
}
