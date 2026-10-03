import { describe, expect, it } from "vitest";
import { easeFactor, easeToward } from "../lib/ease";

describe("easeFactor", () => {
  it("is 0 when no time has passed", () => {
    expect(easeFactor(0, 6)).toBe(0);
  });
  it("is 1 for infinite speed (reduced motion)", () => {
    expect(easeFactor(0, Infinity)).toBe(1);
    expect(easeFactor(0.016, Infinity)).toBe(1);
  });
  it("grows with time and stays below 1 for finite speed", () => {
    const a = easeFactor(0.016, 6);
    const b = easeFactor(0.1, 6);
    expect(a).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(a);
    expect(b).toBeLessThan(1);
  });
});

describe("easeToward", () => {
  it("does not move with dt 0", () => {
    expect(easeToward(0.2, 1, 0, 6)).toBe(0.2);
  });
  it("jumps to the target for infinite speed", () => {
    expect(easeToward(0, 1, 0, Infinity)).toBe(1);
  });
  it("moves toward the target without overshooting", () => {
    let v = 0;
    for (let i = 0; i < 20; i++) {
      const next = easeToward(v, 1, 0.016, 6);
      expect(next).toBeGreaterThanOrEqual(v);
      expect(next).toBeLessThanOrEqual(1);
      v = next;
    }
    expect(v).toBeGreaterThan(0.3);
  });
  it("converges", () => {
    let v = 0;
    for (let i = 0; i < 600; i++) v = easeToward(v, 1, 0.016, 6);
    expect(v).toBeCloseTo(1, 3);
  });
});
