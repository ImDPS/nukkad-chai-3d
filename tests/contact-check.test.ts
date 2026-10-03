import { describe, expect, it } from "vitest";
import { findProblems } from "../scripts/contact-check.mjs";

describe("findProblems", () => {
  it("accepts a clean page with prices, hours and an svg", () => {
    const html = `<html><body><svg viewBox="0 0 400 260"></svg>
      <p>₹15</p><p>₹30</p><p>6:00 am to 11:00 am, 4:00 pm to 9:00 pm</p></body></html>`;
    expect(findProblems(html)).toEqual([]);
  });

  it("flags mailto and tel links", () => {
    expect(findProblems('<a href="mailto:x@y.com">mail</a>')).toContain("mailto link");
    expect(findProblems('<a href="tel:+911234567890">call</a>')).toContain("tel link");
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

  it("flags an email address inside an attribute value", () => {
    expect(findProblems('<img alt="a@b.com">')).toContain("email address");
  });

  it("flags a phone number inside attribute values", () => {
    expect(findProblems('<meta name="description" content="call 9876543210">')).toContain(
      "phone-like number",
    );
    expect(findProblems('<button aria-label="Call 98765 43210">x</button>')).toContain(
      "phone-like number",
    );
  });

  it("flags contact details inside JSON scripts", () => {
    const ld = (body: string) => `<script type="application/ld+json">${body}</script>`;
    expect(findProblems(ld('{"telephone":"+91 98765 43210"}'))).toContain("phone-like number");
    expect(findProblems(ld('{"email":"owner@example.com"}'))).toContain("email address");
    expect(findProblems(ld('{"email":"owner\\u0040example.com"}'))).toContain("email address");
    expect(
      findProblems('<script type="application/json">{"t":"9876543210"}</script>'),
    ).toContain("phone-like number");
  });

  it("flags entity-encoded contact details", () => {
    expect(findProblems("<p>a&#64;b.com</p>")).toContain("email address");
    expect(findProblems("<p>a&#x40;b.com</p>")).toContain("email address");
    expect(findProblems("<p>a&commat;b.com</p>")).toContain("email address");
    expect(findProblems('<a href="mail&#116;o:x@y.com">m</a>')).toContain("mailto link");
    expect(findProblems('<a href="&#109;ailto&colon;x">m</a>')).toContain("mailto link");
    expect(findProblems("<p>9876&#32;543&#32;210</p>")).toContain("phone-like number");
  });

  it("flags a tel scheme with a space before the colon", () => {
    expect(findProblems('<a href="tel :+911234567890">call</a>')).toContain("tel link");
  });

  it("flags contact details hidden in comments", () => {
    expect(findProblems("<!-- ping a@b.com -->")).toContain("email address");
  });

  it("does not flag svg geometry, classes or ordinary scripts", () => {
    const html = `<svg viewBox="0 0 400 260" width="400" height="260"><path d="M10 20 30 40 50 60 70 80"/>
      <polygon points="0 0 100 200 300 400 500 600"/></svg>
      <div class="mt-4 w-10 text-[15px]" style="margin:0 0 0 0">₹15 ₹30</div>
      <script>self.__next_f.push([1,"user@host.dev 1234567890123"])</script>`;
    expect(findProblems(html)).toEqual([]);
  });
});
