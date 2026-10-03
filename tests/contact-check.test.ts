import { describe, expect, it } from "vitest";
import { findProblems } from "../scripts/contact-check.mjs";

describe("findProblems", () => {
  it("accepts a clean page with prices, hours and an svg", () => {
    const html = `<html><body><svg viewBox="0 0 400 260"></svg>
      <p>₹15</p><p>₹30</p><p>6:00 am to 11:00 am, 4:00 pm to 9:00 pm</p></body></html>`;
    expect(findProblems(html)).toEqual([]);
  });

  it("flags mailto and tel links", () => {
    expect(findProblems('<a href="mailto:x@y.com">mail</a>').length).toBeGreaterThan(0);
    expect(findProblems('<a href="tel:+911234567890">call</a>').length).toBeGreaterThan(0);
  });

  it("flags an email address in text", () => {
    expect(findProblems("<p>write to someone@example.com</p>")).toContain("email address");
  });

  it("flags a phone-like number in text", () => {
    expect(findProblems("<p>Call +91 98765 43210 now</p>")).toContain("phone-like number");
  });

  it("ignores script and style contents", () => {
    const html = `<script>var a="user@host.dev 1234567890123";</script><style>@media{}</style><p>ok</p>`;
    expect(findProblems(html)).toEqual([]);
  });
});
