export const TIMELINE_SECONDS = 20;
export const BAR_SECONDS = 2;
export const BEAT_SECONDS = 0.5;
export const SNAP_SECONDS = 0.05;

export function getBarCount(totalSeconds = TIMELINE_SECONDS) {
  return Math.max(1, Math.ceil(totalSeconds / BAR_SECONDS));
}

export function getBarMarks(totalSeconds = TIMELINE_SECONDS) {
  const count = getBarCount(totalSeconds);
  return Array.from({ length: count + 1 }, (_, index) => ({
    index: index + 1,
    time: index * BAR_SECONDS,
    left: (Math.min(index * BAR_SECONDS, totalSeconds) / totalSeconds) * 100
  }));
}
