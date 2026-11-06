import { readJSON, writeJSON } from "../../../shared/lib/storage/jsonStorage";
import { initialNotes } from "../model/initialNotes";

const NOTES_KEY_PREFIX = "dolean_notes_";

function cloneInitialNotes() {
  return initialNotes.map((note) => ({ ...note, drift: [...(note.drift || [])] }));
}

export const noteRepository = {
  get(projectId) {
    const stored = readJSON(`${NOTES_KEY_PREFIX}${projectId}`, null);
    return Array.isArray(stored) && stored.length ? stored : cloneInitialNotes();
  },
  save(projectId, notes) {
    writeJSON(`${NOTES_KEY_PREFIX}${projectId}`, notes);
  },
  reset(projectId) {
    const notes = cloneInitialNotes();
    writeJSON(`${NOTES_KEY_PREFIX}${projectId}`, notes);
    return notes;
  }
};
