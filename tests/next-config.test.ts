import { afterEach, describe, expect, it, vi } from "vitest";

async function loadConfig() {
  vi.resetModules();
  return (await import("../next.config")).default;
}

describe("next.config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds a static export, which GitHub Pages needs", async () => {
    const nextConfig = await loadConfig();
    expect(nextConfig.output).toBe("export");
  });

  it("takes basePath from PAGES_BASE_PATH", async () => {
    vi.stubEnv("PAGES_BASE_PATH", "/nukkad-chai-3d");
    const nextConfig = await loadConfig();
    expect(nextConfig.basePath).toBe("/nukkad-chai-3d");
  });
});
