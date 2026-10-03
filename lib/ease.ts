/** Fraction of the remaining distance to cover this frame. Infinite speed means "jump". */
export function easeFactor(dt: number, speed: number): number {
  if (speed === Infinity) return 1;
  return 1 - Math.exp(-speed * dt);
}

export function easeToward(current: number, target: number, dt: number, speed: number): number {
  return current + (target - current) * easeFactor(dt, speed);
}
