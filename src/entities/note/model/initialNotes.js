const driftFrom = (base) => [
  base + 6,
  base + 3,
  base - 1,
  base - 4,
  base - 2,
  base + 1,
  base + 4,
  base + 2,
  base - 1
];

export const initialNotes = [
  { id: 1, pitch: "A4", row: 3, start: 1.0, duration: 2.2, cents: 18, corrected: false, drift: driftFrom(15) },
  { id: 2, pitch: "B4", row: 1, start: 3.0, duration: 1.2, cents: -8, corrected: false, drift: driftFrom(-6) },
  { id: 3, pitch: "G4", row: 5, start: 4.3, duration: 2.1, cents: 24, corrected: false, drift: driftFrom(21) },
  { id: 4, pitch: "A4", row: 3, start: 6.4, duration: 1.7, cents: 5, corrected: false, drift: driftFrom(4) },
  { id: 5, pitch: "C5", row: 0, start: 8.2, duration: 1.5, cents: -14, corrected: false, drift: driftFrom(-11) },
  { id: 6, pitch: "A4", row: 3, start: 10.0, duration: 1.6, cents: 12, corrected: false, drift: driftFrom(10) },
  { id: 7, pitch: "G4", row: 5, start: 11.8, duration: 2.1, cents: -5, corrected: false, drift: driftFrom(-4) },
  { id: 8, pitch: "B4", row: 1, start: 14.0, duration: 1.4, cents: 9, corrected: false, drift: driftFrom(7) },
  { id: 9, pitch: "E4", row: 8, start: 2.15, duration: 0.75, cents: 7, corrected: false, drift: driftFrom(6) },
  { id: 10, pitch: "D4", row: 10, start: 5.65, duration: 0.7, cents: -11, corrected: false, drift: driftFrom(-9) },
  { id: 11, pitch: "F4", row: 7, start: 12.25, duration: 0.75, cents: -2, corrected: false, drift: driftFrom(-1) },
  { id: 12, pitch: "C5", row: 0, start: 15.7, duration: 1.5, cents: 16, corrected: false, drift: driftFrom(13) }
];

export const pitchRows = [
  "C5", "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4",
  "D#4", "D4", "C#4", "C4", "B3", "A#3", "A3", "G#3", "G3"
];
