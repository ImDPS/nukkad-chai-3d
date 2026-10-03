import { describe, expect, it } from "vitest";
import { buntingFlags } from "../lib/bunting";

describe("buntingFlags", () => {
  const flags = buntingFlags(15, 3.6, 2.05, 0.22, 0.93);

  it("returns the requested number of flags at the given depth", () => {
    expect(flags).toHaveLength(15);
    for (const f of flags) expect(f.z).toBe(0.93);
  });

  it("spans the full width", () => {
    expect(flags[0].x).toBeCloseTo(-1.8, 6);
    expect(flags[14].x).toBeCloseTo(1.8, 6);
  });

  it("hangs from baseY at the ends and sags by `sag` in the middle", () => {
    expect(flags[0].y).toBeCloseTo(2.05, 6);
    expect(flags[14].y).toBeCloseTo(2.05, 6);
    expect(flags[7].y).toBeCloseTo(2.05 - 0.22, 6);
  });

  it("is symmetric, with opposite tilts", () => {
    for (let i = 0; i < 15; i++) {
      expect(flags[i].y).toBeCloseTo(flags[14 - i].y, 6);
      expect(flags[i].tilt).toBeCloseTo(-flags[14 - i].tilt, 6);
    }
    expect(flags[7].tilt).toBeCloseTo(0, 6);
  });

  it("handles a single flag by centring it", () => {
    const [only] = buntingFlags(1, 3.6, 2.05, 0.22, 0.93);
    expect(only.x).toBeCloseTo(0, 6);
    expect(only.y).toBeCloseTo(2.05 - 0.22, 6);
  });
});
