import { describe, expect, it } from "vitest";
import { findProblems } from "../scripts/contact-check.mjs";
import { AWNINGS, EVENTS, HOURS, LOCATION, MENU, SITE, TEAS } from "../lib/content";

const HEX = /^#[0-9a-f]{6}$/i;

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

describe("content", () => {
  it("has 6 to 8 menu items with unique ids and positive whole-rupee prices", () => {
    expect(MENU.length).toBeGreaterThanOrEqual(6);
    expect(MENU.length).toBeLessThanOrEqual(8);
    expect(new Set(MENU.map((m) => m.id)).size).toBe(MENU.length);
    for (const item of MENU) {
      expect(Number.isInteger(item.price)).toBe(true);
      expect(item.price).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
    }
  });

  it("defines three teas and three awnings with valid hex colours", () => {
    expect(TEAS.map((t) => t.id)).toEqual(["masala", "ginger", "lemon"]);
    expect(AWNINGS.map((a) => a.id)).toEqual(["marigold", "indigo", "leaf"]);
    for (const tea of TEAS) {
      expect(tea.liquid).toMatch(HEX);
      expect(tea.steam).toMatch(HEX);
    }
    for (const awning of AWNINGS) {
      expect(awning.primary).toMatch(HEX);
      expect(awning.secondary).toMatch(HEX);
    }
  });

  it("has hours and events", () => {
    expect(HOURS.length).toBeGreaterThan(0);
    expect(EVENTS.length).toBeGreaterThanOrEqual(2);
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
  });

  it("says the stall is fictional", () => {
    expect(SITE.disclaimer.toLowerCase()).toContain("fictional");
    expect(SITE.disclaimer.toLowerCase()).toContain("concept project");
  });

  it("contains no contact details anywhere", () => {
    const strings = allStrings({ MENU, HOURS, EVENTS, LOCATION, SITE, TEAS, AWNINGS });
    for (const s of strings) {
      expect(findProblems(`<p>${s}</p>`)).toEqual([]);
      expect(s).not.toMatch(/https?:\/\//i);
    }
  });
});
