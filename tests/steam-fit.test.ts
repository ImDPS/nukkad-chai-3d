import { describe, expect, it } from "vitest";
import { STEAM_HEIGHT } from "../lib/steam";
import {
  AWNING_UNDERSIDE_Y,
  STEAM_CEILING_MARGIN,
  STEAM_START_Y,
  STEAM_Y_SCALE,
  GLASS_Y,
  GLASS_SCALE,
  steamYScale,
} from "../lib/steam-fit";

describe("steamYScale", () => {
  it("puts the top of the steam exactly at ceiling minus margin", () => {
    const s = steamYScale({ startY: 1.6, ceilingY: 2.2, margin: 0.1, height: 0.9, parentScale: 1.5 });
    expect(1.6 + 1.5 * s * 0.9).toBeCloseTo(2.1, 10);
  });

  it("never returns a negative scale when there is no headroom", () => {
    expect(steamYScale({ startY: 2.3, ceilingY: 2.2, margin: 0.1, height: 0.9, parentScale: 1.5 })).toBe(0);
  });
});

describe("the shipped steam scale", () => {
  it("keeps the highest puff under the awning with the margin to spare", () => {
    const worldTop = GLASS_Y + GLASS_SCALE * (STEAM_START_Y + STEAM_Y_SCALE * STEAM_HEIGHT);
    expect(worldTop).toBeLessThanOrEqual(AWNING_UNDERSIDE_Y - STEAM_CEILING_MARGIN + 1e-9);
  });

  it("still leaves a visible plume", () => {
    expect(GLASS_SCALE * STEAM_Y_SCALE * STEAM_HEIGHT).toBeGreaterThan(0.3);
  });
});
