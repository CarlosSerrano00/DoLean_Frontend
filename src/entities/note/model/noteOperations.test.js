import assert from "node:assert/strict";
import test from "node:test";
import { splitNote, updateNote } from "./noteOperations.js";

const notes = [
  { id: 1, start: 2, duration: 2, cents: 5 },
  { id: 2, start: 5, duration: 1, cents: -3 }
];

test("note updates are immutable and convert values to numbers", () => {
  const updated = updateNote(notes, 1, "cents", "12");

  assert.equal(updated[0].cents, 12);
  assert.notEqual(updated, notes);
  assert.equal(notes[0].cents, 5);
});

test("note updates reject unsupported properties and non-numeric values", () => {
  assert.throws(() => updateNote(notes, 1, "pitch", "A4"), /no se puede editar/);
  assert.throws(() => updateNote(notes, 1, "start", "invalid"), /numérico/);
});

test("splitting a note creates two consecutive segments", () => {
  const result = splitNote(notes, 1, 3);

  assert.deepEqual(result, [
    { id: 1, start: 2, duration: 1, cents: 5 },
    { id: 3, start: 3, duration: 1, cents: 5 },
    notes[1]
  ]);
});

test("splitting a missing or too-short note is rejected", () => {
  assert.equal(splitNote(notes, 99, 3), null);
  assert.equal(splitNote([{ id: 4, start: 0, duration: 0.5 }], 4, 5), null);
});
