import assert from "node:assert/strict";
import test from "node:test";
import { createLocalProject } from "./createLocalProject.js";

test("project creation uses the provided name and default metadata", () => {
  assert.deepEqual(createLocalProject({ name: " Ensayo ", id: 12 }), {
    id: "p-12",
    name: "Ensayo",
    date: "Ahora",
    files: 0,
    status: "En edición",
    duration: "00:00",
    source: "Sin archivo"
  });
});

test("project creation uses the uploaded file name when no project name is provided", () => {
  const project = createLocalProject({ name: "", file: { name: "voz.wav" }, id: 15 });

  assert.equal(project.name, "voz");
  assert.equal(project.files, 1);
  assert.equal(project.source, "voz.wav");
});
