export const STEAM_HEIGHT = 0.9;
const RISE_SPEED = 0.18; // fraction of the full height per second
const GOLDEN_ANGLE = 2.399963;

/** Position of particle i of `count` at `time` seconds, relative to the top of the glass. */
export function steamPosition(
  i: number,
  count: number,
  time: number,
): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0];
  writeSteamPosition(out, 0, i, count, time);
  return out;
}

/** Writes the x, y, z of particle i into out from `offset`, allocating nothing. */
function writeSteamPosition(
  out: Float32Array | number[],
  offset: number,
  i: number,
  count: number,
  time: number,
): void {
  const life = (time * RISE_SPEED + i / count) % 1; // 0 at the glass, 1 at the top
  const angle = i * GOLDEN_ANGLE + time * 0.6;
  const radius = 0.03 + life * 0.12;
  out[offset] = Math.cos(angle) * radius;
  out[offset + 1] = life * STEAM_HEIGHT;
  out[offset + 2] = Math.sin(angle) * radius;
}

export function fillSteam(out: Float32Array, count: number, time: number): void {
  for (let i = 0; i < count; i++) writeSteamPosition(out, i * 3, i, count, time);
}
