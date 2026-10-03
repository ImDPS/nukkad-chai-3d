export interface Flag {
  x: number;
  y: number;
  z: number;
  /** rotation around Z, in radians, so each flag follows the rope */
  tilt: number;
}

/** Flags along a parabolic rope: baseY at both ends, `sag` lower in the middle. */
export function buntingFlags(
  count: number,
  width: number,
  baseY: number,
  sag: number,
  z: number,
): Flag[] {
  const flags: Flag[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const u = 2 * t - 1; // -1 at the left end, +1 at the right end
    const x = u * (width / 2);
    const y = baseY - sag * (1 - u * u);
    const slope = (4 * sag * u) / width; // dy/dx
    flags.push({ x, y, z, tilt: Math.atan(slope) });
  }
  return flags;
}
