export function buildDemoPeaks(count = 220, seed = 3) {
  return Array.from({ length: count }, (_, index) => {
    const envelope = 0.34 + Math.abs(Math.sin(index * 0.17 + seed)) * 0.48;
    const transient = Math.abs(Math.sin(index * 0.61 + seed * 2)) * 0.28;
    const body = Math.abs(Math.cos(index * 0.08)) * 0.22;
    return Math.min(1, Math.max(0.05, envelope * 0.62 + transient + body));
  });
}
