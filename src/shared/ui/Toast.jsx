import { CheckCircle2 } from "lucide-react";

export function Toast({ message }) {
  return <div className="toast"><CheckCircle2 size={17} /> {message}</div>;
}
