import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The test environment is node (no DOM library is installed), so React's
// useSyncExternalStore is replaced with a stub that hands back the two snapshot
// functions. That lets the hook's client and server results be checked directly,
// with window and document stubbed per test.
vi.mock("react", () => ({
  useSyncExternalStore: (
    _subscribe: unknown,
    getSnapshot: () => boolean | null,
    getServerSnapshot: () => boolean | null,
  ) => ({ client: getSnapshot, server: getServerSnapshot }),
}));

type Snapshots = { client: () => boolean | null; server: () => boolean | null };

async function loadHook(): Promise<Snapshots> {
  vi.resetModules(); // the module caches its result, so each test starts fresh
  const mod = await import("../lib/webgl");
  // Called through a plain alias: this is a test helper, not a React component.
  const readSupport = mod.useWebGLSupport as unknown as () => Snapshots;
  return readSupport();
}

function stubBrowser(search: string, getContext: (type: string) => unknown) {
  vi.stubGlobal("window", { location: { search } });
  vi.stubGlobal("document", { createElement: () => ({ getContext }) });
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useWebGLSupport", () => {
  it("is null while server-rendering or hydrating", async () => {
    const snapshots = await loadHook();
    expect(snapshots.server()).toBeNull();
  });

  it("is true when a WebGL context can be created", async () => {
    const loseContext = vi.fn();
    stubBrowser("", () => ({ getExtension: () => ({ loseContext }) }));
    const snapshots = await loadHook();
    expect(snapshots.client()).toBe(true);
    expect(loseContext).toHaveBeenCalledOnce();
  });

  it("is false when no WebGL context is available", async () => {
    stubBrowser("", () => null);
    const snapshots = await loadHook();
    expect(snapshots.client()).toBe(false);
  });

  it("is false when creating a context throws", async () => {
    stubBrowser("", () => {
      throw new Error("blocked");
    });
    const snapshots = await loadHook();
    expect(snapshots.client()).toBe(false);
  });

  it("is false with ?nowebgl, without even trying a context", async () => {
    const getContext = vi.fn(() => ({ getExtension: () => null }));
    stubBrowser("?nowebgl", getContext);
    const snapshots = await loadHook();
    expect(snapshots.client()).toBe(false);
    expect(getContext).not.toHaveBeenCalled();
  });

  it("detects once and reuses the answer", async () => {
    const getContext = vi.fn(() => ({ getExtension: () => null }));
    stubBrowser("", getContext);
    const snapshots = await loadHook();
    snapshots.client();
    snapshots.client();
    expect(getContext).toHaveBeenCalledOnce();
  });
});
