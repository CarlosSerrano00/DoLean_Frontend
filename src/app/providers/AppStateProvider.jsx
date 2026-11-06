import { useEffect, useMemo, useState } from "react";
import { projectRepository, ProjectsContext } from "../../entities/project";
import { sessionRepository, SessionContext } from "../../entities/user";

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(() => sessionRepository.get());
  const [projects, setProjects] = useState(() => projectRepository.getAll());

  useEffect(() => {
    if (user) sessionRepository.save(user);
    else sessionRepository.clear();
  }, [user]);

  useEffect(() => {
    projectRepository.saveAll(projects);
  }, [projects]);

  const session = useMemo(() => ({ user, setUser }), [user]);
  const projectState = useMemo(() => ({ projects, setProjects }), [projects]);
  return (
    <SessionContext.Provider value={session}>
      <ProjectsContext.Provider value={projectState}>{children}</ProjectsContext.Provider>
    </SessionContext.Provider>
  );
}
