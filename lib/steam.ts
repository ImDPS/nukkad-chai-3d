export const STEAM_HEIGHT = 0.9;
const RISE_SPEED = 0.18; // fraction of the full height per second
const GOLDEN_ANGLE = 2.399963;

/** Position of particle i of `count` at `time` seconds, relative to the top of the glass. */
export function steamPosition(
  i: number,
  count: number,
  time: number,
): [number, number, number] {
  const life = (time * RISE_SPEED + i / count) % 1; // 0 at the glass, 1 at the top
  const angle = i * GOLDEN_ANGLE + time * 0.6;
  const radius = 0.03 + life * 0.12;
  return [Math.cos(angle) * radius, life * STEAM_HEIGHT, Math.sin(angle) * radius];
}

export function fillSteam(out: Float32Array, count: number, time: number): void {
  for (let i = 0; i < count; i++) {
    const [x, y, z] = steamPosition(i, count, time);
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}
