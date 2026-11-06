const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SEMITONE_INDEX = Object.fromEntries(NOTE_NAMES.map((name, index) => [name, index]));

export function parsePitch(pitch = "A4") {
  const match = /^([A-G]#?)(-?\d)$/.exec(String(pitch).trim());
  if (!match) return null;
  return { name: match[1], octave: Number(match[2]) };
}

export function pitchToMidi(pitch) {
  const parsed = parsePitch(pitch);
  if (!parsed) return null;
  return (parsed.octave + 1) * 12 + SEMITONE_INDEX[parsed.name];
}

export function midiToPitch(midi) {
  const safeMidi = Math.max(0, Math.min(127, Math.round(midi)));
  const octave = Math.floor(safeMidi / 12) - 1;
  return `${NOTE_NAMES[safeMidi % 12]}${octave}`;
}

export function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function pitchToFrequency(pitch, cents = 0) {
  const midi = pitchToMidi(pitch);
  if (midi === null) return 0;
  return midiToFrequency(midi + Number(cents) / 100);
}

export function pitchToOctave(pitch) {
  return parsePitch(pitch)?.octave ?? "—";
}

export function createPitchRange(highPitch, lowPitch) {
  const high = pitchToMidi(highPitch);
  const low = pitchToMidi(lowPitch);
  if (high === null || low === null || high < low) return [];
  return Array.from({ length: high - low + 1 }, (_, index) => midiToPitch(high - index));
}

export function isBlackKey(pitch) {
  return String(pitch).includes("#");
}
