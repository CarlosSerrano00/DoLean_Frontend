const editableNoteProperties = new Set(["cents", "start", "duration"]);

export function updateNote(notes, noteId, property, value) {
  if (!editableNoteProperties.has(property)) {
    throw new Error(`La propiedad "${property}" no se puede editar.`);
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    throw new Error("El valor de edición debe ser numérico.");
  }

  return notes.map(note => note.id === noteId ? { ...note, [property]: numericValue } : note);
}

export function splitNote(notes, noteId, newNoteId) {
  const selectedNote = notes.find(note => note.id === noteId);
  if (!selectedNote || selectedNote.duration < 0.8) return null;

  const halfDuration = selectedNote.duration / 2;
  return notes.flatMap(note => note.id === noteId ? [
    { ...note, duration: halfDuration },
    { ...note, id: newNoteId, start: note.start + halfDuration, duration: halfDuration }
  ] : [note]);
}
