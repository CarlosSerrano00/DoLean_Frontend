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

export function moveNote(notes, noteId, patch = {}) {
  const note = notes.find(item => item.id === noteId);
  if (!note) return notes;

  const next = { ...note };
  if (patch.start !== undefined) {
    const start = Number(patch.start);
    if (!Number.isFinite(start)) throw new Error("La posición de la nota debe ser numérica.");
    next.start = Math.max(0, start);
  }
  if (patch.duration !== undefined) {
    const duration = Number(patch.duration);
    if (!Number.isFinite(duration)) throw new Error("La duración de la nota debe ser numérica.");
    next.duration = Math.max(0.2, duration);
  }
  if (patch.row !== undefined) {
    const row = Number(patch.row);
    if (!Number.isFinite(row)) throw new Error("La fila de la nota debe ser numérica.");
    next.row = Math.max(0, Math.round(row));
  }
  if (patch.pitch !== undefined) {
    next.pitch = patch.pitch;
  }
  next.corrected = next.cents === 0;

  return notes.map(item => item.id === noteId ? next : item);
}

export function setNotePitch(notes, noteId, pitch, row) {
  return notes.map(note => note.id === noteId ? { ...note, pitch, row } : note);
}

export function deleteNote(notes, noteId) {
  return notes.filter(note => note.id !== noteId);
}

export function correctNote(notes, noteId) {
  return notes.map(note => note.id === noteId
    ? { ...note, cents: 0, corrected: true, drift: (note.drift || []).map(() => 0) }
    : note
  );
}

export function splitNote(notes, noteId, newNoteId) {
  const selectedNote = notes.find(note => note.id === noteId);
  if (!selectedNote || selectedNote.duration < 0.8) return null;

  const halfDuration = selectedNote.duration / 2;
  return notes.flatMap(note => note.id === noteId ? [
    { ...note, duration: halfDuration },
    { ...note, id: newNoteId, start: note.start + halfDuration, duration: halfDuration }
  ] : note);
}

export function splitNoteAt(notes, noteId, splitTime, newNoteId) {
  const selectedNote = notes.find(note => note.id === noteId);
  if (!selectedNote) return null;

  const relative = Number(splitTime) - selectedNote.start;
  if (!Number.isFinite(relative)) return null;
  if (relative < 0.16 || relative > selectedNote.duration - 0.16) return null;

  const firstDuration = relative;
  const secondDuration = selectedNote.duration - relative;
  const drift = selectedNote.drift || [];
  const driftSplit = drift.length
    ? Math.max(1, Math.round((drift.length * relative) / selectedNote.duration))
    : 0;

  return notes.flatMap(note => note.id === noteId ? [
    {
      ...note,
      duration: firstDuration,
      drift: drift.length ? drift.slice(0, driftSplit) : drift
    },
    {
      ...note,
      id: newNoteId,
      start: selectedNote.start + firstDuration,
      duration: secondDuration,
      drift: drift.length ? drift.slice(driftSplit) : drift
    }
  ] : note);
}
