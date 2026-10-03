import { describe, expect, it } from "vitest";
import { findProblems } from "../scripts/contact-check.mjs";

// The scanner needs contact-shaped inputs, but the repository must hold no
// contact detail, not even a made-up one. Every fixture is therefore joined at
// runtime from parts, so no phone number or email address appears as a literal.
const AT = "@";
const email = (user: string, host: string) => [user, host].join(AT);
const phone = (...groups: string[]) => groups.join(" ");
const digits = (...groups: string[]) => groups.join("");

const MOBILE_GROUPED = phone("98765", "43210");
const MOBILE_PLAIN = digits("98765", "43210");
const MOBILE_WITH_CODE = phone("+91", MOBILE_GROUPED);
const TEL_NUMBER = digits("+91", "1234", "567890");
const LONG_DIGITS = digits("1234", "5678", "90123");

describe("findProblems", () => {
  it("accepts a clean page with prices, hours and an svg", () => {
    const html = `<html><body><svg viewBox="0 0 400 260"></svg>
      <p>₹15</p><p>₹30</p><p>6:00 am to 11:00 am, 4:00 pm to 9:00 pm</p></body></html>`;
    expect(findProblems(html)).toEqual([]);
  });

  it("flags mailto and tel links", () => {
    expect(findProblems(`<a href="mailto:${email("x", "y.com")}">mail</a>`)).toContain(
      "mailto link",
    );
    expect(findProblems(`<a href="tel:${TEL_NUMBER}">call</a>`)).toContain("tel link");
  });

  it("flags an email address in text", () => {
    expect(findProblems(`<p>write to ${email("someone", "example.com")}</p>`)).toContain(
      "email address",
    );
  });

  it("flags a phone-like number in text", () => {
    expect(findProblems(`<p>Call ${MOBILE_WITH_CODE} now</p>`)).toContain("phone-like number");
  });

  it("ignores script and style contents", () => {
    const html = `<script>var a="${email("user", "host.dev")} ${LONG_DIGITS}";</script><style>@media{}</style><p>ok</p>`;
    expect(findProblems(html)).toEqual([]);
  });

  it("flags an email address inside an attribute value", () => {
    expect(findProblems(`<img alt="${email("a", "b.com")}">`)).toContain("email address");
  });

  it("flags a phone number inside attribute values", () => {
    expect(
      findProblems(`<meta name="description" content="call ${MOBILE_PLAIN}">`),
    ).toContain("phone-like number");
    expect(findProblems(`<button aria-label="Call ${MOBILE_GROUPED}">x</button>`)).toContain(
      "phone-like number",
    );
  });

  it("flags contact details inside JSON scripts", () => {
    const ld = (body: string) => `<script type="application/ld+json">${body}</script>`;
    expect(findProblems(ld(`{"telephone":"${MOBILE_WITH_CODE}"}`))).toContain(
      "phone-like number",
    );
    expect(findProblems(ld(`{"email":"${email("owner", "example.com")}"}`))).toContain(
      "email address",
    );
    expect(findProblems(ld(`{"email":"${["owner", "example.com"].join("\\u0040")}"}`))).toContain(
      "email address",
    );
    expect(
      findProblems(`<script type="application/json">{"t":"${MOBILE_PLAIN}"}</script>`),
    ).toContain("phone-like number");
  });

  it("flags entity-encoded contact details", () => {
    const encoded = (entity: string) => `<p>${["a", "b.com"].join(entity)}</p>`;
    expect(findProblems(encoded("&#64;"))).toContain("email address");
    expect(findProblems(encoded("&#x40;"))).toContain("email address");
    expect(findProblems(encoded("&commat;"))).toContain("email address");
    expect(findProblems(`<a href="mail&#116;o:${email("x", "y.com")}">m</a>`)).toContain(
      "mailto link",
    );
    expect(findProblems('<a href="&#109;ailto&colon;x">m</a>')).toContain("mailto link");
    expect(findProblems(`<p>${["9876", "543", "210"].join("&#32;")}</p>`)).toContain(
      "phone-like number",
    );
  });

  it("flags a tel scheme with a space before the colon", () => {
    expect(findProblems(`<a href="tel :${TEL_NUMBER}">call</a>`)).toContain("tel link");
  });

  it("flags contact details hidden in comments", () => {
    expect(findProblems(`<!-- ping ${email("a", "b.com")} -->`)).toContain("email address");
  });

  it("does not flag svg geometry, classes or ordinary scripts", () => {
    const html = `<svg viewBox="0 0 400 260" width="400" height="260"><path d="M10 20 30 40 50 60 70 80"/>
      <polygon points="0 0 100 200 300 400 500 600"/></svg>
      <div class="mt-4 w-10 text-[15px]" style="margin:0 0 0 0">₹15 ₹30</div>
      <script>self.__next_f.push([1,"${email("user", "host.dev")} ${LONG_DIGITS}"])</script>`;
    expect(findProblems(html)).toEqual([]);
  });
});
