import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CUSTOMISER, useCustomiser } from "../lib/store";

beforeEach(() => {
  useCustomiser.setState({ ...DEFAULT_CUSTOMISER });
});

describe("customiser store", () => {
  it("starts with masala chai, the marigold awning and day", () => {
    const s = useCustomiser.getState();
    expect([s.tea, s.awning, s.time]).toEqual(["masala", "marigold", "day"]);
  });

  it("accepts valid choices", () => {
    useCustomiser.getState().setTea("lemon");
    useCustomiser.getState().setAwning("indigo");
    useCustomiser.getState().setTime("night");
    const s = useCustomiser.getState();
    expect([s.tea, s.awning, s.time]).toEqual(["lemon", "indigo", "night"]);
  });

  it("ignores values that are not valid choices", () => {
    useCustomiser.getState().setTea("coffee");
    useCustomiser.getState().setAwning("purple");
    useCustomiser.getState().setTime("dusk");
    const s = useCustomiser.getState();
    expect([s.tea, s.awning, s.time]).toEqual(["masala", "marigold", "day"]);
  });
});
