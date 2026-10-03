import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { silenceThreeClockWarning } from "../lib/console-filter";

const CLOCK_MESSAGE =
  "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.";

describe("silenceThreeClockWarning", () => {
  const realWarn = console.warn;
  let original: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    original = vi.fn();
    console.warn = original as unknown as typeof console.warn;
  });

  afterEach(() => {
    console.warn = realWarn;
  });

  it("swallows the Clock deprecation message", () => {
    silenceThreeClockWarning();
    console.warn(CLOCK_MESSAGE);
    expect(original).not.toHaveBeenCalled();
  });

  it("swallows the message with or without the THREE. prefix", () => {
    silenceThreeClockWarning();
    console.warn("Clock: This module has been deprecated. Use Timer.");
    console.warn(`[three] ${CLOCK_MESSAGE}`);
    expect(original).not.toHaveBeenCalled();
  });

  it("passes unrelated warnings through with identical arguments and this", () => {
    silenceThreeClockWarning();
    const extra = { a: 1 };
    console.warn("something else", extra, 42);
    expect(original).toHaveBeenCalledTimes(1);
    expect(original).toHaveBeenCalledWith("something else", extra, 42);
    expect(original.mock.contexts[0]).toBe(console);
  });

  it("passes through non-string first arguments and other Clock messages", () => {
    silenceThreeClockWarning();
    console.warn({ message: CLOCK_MESSAGE });
    console.warn("THREE.Clock: something different");
    console.warn("three clock: this module has been deprecated");
    expect(original).toHaveBeenCalledTimes(3);
  });

  it("does not double-wrap when called twice", () => {
    silenceThreeClockWarning();
    const afterFirst = console.warn;
    silenceThreeClockWarning();
    expect(console.warn).toBe(afterFirst);
    console.warn("unrelated");
    expect(original).toHaveBeenCalledTimes(1);
  });
});
