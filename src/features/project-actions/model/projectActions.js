export function renameProject(projects, projectId, nextName) {
  const name = String(nextName || "").trim();
  if (!name) return projects;
  return projects.map((project) =>
    project.id === projectId ? { ...project, name, date: "Ahora" } : project
  );
}

export function removeProject(projects, projectId) {
  return projects.filter((project) => project.id !== projectId);
}
