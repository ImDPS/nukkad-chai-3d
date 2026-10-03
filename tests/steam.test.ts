import { describe, expect, it } from "vitest";
import { STEAM_HEIGHT, fillSteam, steamPosition } from "../lib/steam";

describe("steamPosition", () => {
  it("stays between the glass and the maximum height", () => {
    for (let i = 0; i < 36; i++) {
      for (const t of [0, 0.5, 3.3, 120.7]) {
        const [, y] = steamPosition(i, 36, t);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThan(STEAM_HEIGHT);
      }
    }
  });

  it("is deterministic", () => {
    expect(steamPosition(5, 36, 2.5)).toEqual(steamPosition(5, 36, 2.5));
  });

  it("spreads particles over different heights at time 0", () => {
    const ys = new Set(Array.from({ length: 36 }, (_, i) => steamPosition(i, 36, 0)[1].toFixed(4)));
    expect(ys.size).toBe(36);
  });

  it("widens with height", () => {
    const [x, y, z] = steamPosition(10, 36, 1);
    expect(Math.hypot(x, z)).toBeCloseTo(0.03 + (y / STEAM_HEIGHT) * 0.12, 6);
  });
});

describe("fillSteam", () => {
  it("writes count * 3 values matching steamPosition", () => {
    const out = new Float32Array(36 * 3);
    fillSteam(out, 36, 1.25);
    for (let i = 0; i < 36; i++) {
      const [x, y, z] = steamPosition(i, 36, 1.25);
      expect(out[i * 3]).toBeCloseTo(x, 5);
      expect(out[i * 3 + 1]).toBeCloseTo(y, 5);
      expect(out[i * 3 + 2]).toBeCloseTo(z, 5);
    }
  });
});
