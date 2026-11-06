import { readJSON, writeJSON } from "../../../shared/lib/storage/jsonStorage";
import { seedProjects } from "../model/constants";

const PROJECTS_KEY = "dolean_projects";

export const projectRepository = {
  getAll() {
    return readJSON(PROJECTS_KEY, seedProjects);
  },
  saveAll(projects) {
    writeJSON(PROJECTS_KEY, projects);
  }
};
