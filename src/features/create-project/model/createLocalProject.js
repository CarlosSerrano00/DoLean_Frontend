export function createLocalProject({ name, file, id = Date.now() }) {
  const projectName = name.trim() || file?.name.replace(/\.[^/.]+$/, "") || "Proyecto sin título";

  return {
    id: `p-${id}`,
    name: projectName,
    date: "Ahora",
    files: file ? 1 : 0,
    status: "En edición",
    duration: "00:00",
    source: file?.name || "Sin archivo"
  };
}
