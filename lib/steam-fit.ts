import { STEAM_HEIGHT } from "./steam";

/** Vertical scale that keeps a plume of `height` below `ceilingY - margin` in world space. */
export function steamYScale(args: {
  startY: number; // world y where the plume starts
  ceilingY: number; // world y of the roof underside
  margin: number; // clear gap kept under the roof (covers the puff size too)
  height: number; // unscaled plume height
  parentScale: number; // uniform scale of the group that holds the plume
}): number {
  const room = args.ceilingY - args.margin - args.startY;
  return Math.max(0, room / (args.parentScale * args.height));
}

// Geometry (see Stall.tsx and TeaGlass.tsx):
// Awning group centre y 2.35, tilted 0.32 rad, 0.05 thick. At the front edge of
// the steam (world z about 0.43) the underside is
//   2.35 - (0.43 - 0.1) * tan(0.32) - 0.025 / cos(0.32) = about 2.216,
// so 2.2 is a safe ceiling for the whole plume.
export const AWNING_UNDERSIDE_Y = 2.2;
// 0.1 clear gap, which also covers the puff radius (point size 0.07, so 0.035).
export const STEAM_CEILING_MARGIN = 0.1;
export const GLASS_Y = 1.0;
export const GLASS_SCALE = 1.5;
export const STEAM_START_Y = 0.4; // local y of the steam group inside the glass group

/**
 * Plume starts at world y 1.0 + 1.5 * 0.4 = 1.6. Room under 2.2 - 0.1 = 2.1 is 0.5.
 * Full height is 1.5 * 0.9 = 1.35 unscaled, so the Y scale is 0.5 / 1.35 = about 0.370.
 * Highest puff top: 1.6 + 1.5 * 0.37 * 0.9 = about 2.1 (plus 0.035 puff radius = 2.135).
 */
export const STEAM_Y_SCALE = steamYScale({
  startY: GLASS_Y + GLASS_SCALE * STEAM_START_Y,
  ceilingY: AWNING_UNDERSIDE_Y,
  margin: STEAM_CEILING_MARGIN,
  height: STEAM_HEIGHT,
  parentScale: GLASS_SCALE,
});
