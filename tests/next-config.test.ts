import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("next.config", () => {
  it("builds a static export, which GitHub Pages needs", () => {
    expect(nextConfig.output).toBe("export");
  });

  it("takes basePath from PAGES_BASE_PATH", () => {
    expect(nextConfig.basePath).toBe(process.env.PAGES_BASE_PATH);
  });
});
