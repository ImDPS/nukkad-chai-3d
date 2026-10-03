import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const NAMED_ENTITIES = {
  amp: "&",
  commat: "@",
  colon: ":",
  plus: "+",
  period: ".",
  lpar: "(",
  rpar: ")",
  sol: "/",
  num: "#",
  lowbar: "_",
  hyphen: "-",
  dash: "-",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  tab: " ",
  newline: " ",
};

/** Attributes that hold geometry, styling or identifiers, never contact text. */
const SKIPPED_ATTRIBUTES = new Set([
  "viewbox", "d", "points", "transform", "gradienttransform", "patterntransform",
  "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "dx", "dy",
  "width", "height", "offset", "style", "class", "id", "fill", "stroke",
  "stroke-dasharray", "stroke-dashoffset", "opacity", "values", "keytimes", "keysplines",
]);

/** @param {string} value @returns {string} */
function decodeEntities(value) {
  let current = value;
  for (let pass = 0; pass < 3; pass++) {
    const next = current
      .replace(/&#x([0-9a-f]+);?/gi, (m, hex) => safeChar(parseInt(hex, 16), m))
      .replace(/&#(\d+);?/g, (m, dec) => safeChar(parseInt(dec, 10), m))
      .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
    if (next === current) break;
    current = next;
  }
  return current;
}

/** @param {number} code @param {string} fallback @returns {string} */
function safeChar(code, fallback) {
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : fallback;
}

/** @param {string} tag @returns {string} attribute values worth scanning, joined by " | " */
function attributeText(tag) {
  const values = [];
  const attribute = /\s([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(attribute)) {
    if (SKIPPED_ATTRIBUTES.has(match[1].toLowerCase())) continue;
    values.push(match[2] ?? match[3] ?? match[4]);
  }
  return values.join(" | ");
}

/**
 * Returns the contact-detail problems found in an HTML document.
 * Ordinary scripts and styles are ignored, but JSON scripts (for example
 * ld+json) are scanned. Entities are decoded first. Phone and email checks run
 * on text and on attribute values, with tags replaced by "|" so numbers in
 * neighbouring elements never join up. Geometry attributes (viewBox, d,
 * points and the like) are skipped.
 * @param {string} html
 * @returns {string[]}
 */
export function findProblems(html) {
  const withoutCode = html
    .replace(/<!--([\s\S]*?)-->/g, " | $1 | ")
    .replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_, attrs, body) =>
      /type\s*=\s*["']?[^"'>\s]*json/i.test(attrs)
        ? ` | ${body.replace(/\\u([0-9a-f]{4})/gi, (m, hex) => safeChar(parseInt(hex, 16), m))} | `
        : " ",
    )
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const tag = /<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
  const text = decodeEntities(withoutCode.replace(tag, (t) => ` | ${attributeText(t)} | `));
  const decoded = decodeEntities(withoutCode);
  const problems = [];
  if (/mailto\s*:/i.test(decoded)) problems.push("mailto link");
  if (/\btel\s*:/i.test(decoded)) problems.push("tel link");
  if (/[\w.+-]+@[\w-]+\.[\w.-]+/.test(text)) problems.push("email address");
  if (/\+?\d[\d\s().-]{8,}\d/.test(text)) problems.push("phone-like number");
  return problems;
}

/** @param {string} dir @returns {string[]} */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith(".html") ? [path] : [];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ?? "out";
  let failed = false;
  for (const file of htmlFiles(root)) {
    const problems = findProblems(readFileSync(file, "utf8"));
    if (problems.length > 0) {
      failed = true;
      console.error(`${file}: ${problems.join(", ")}`);
    }
  }
  if (failed) process.exit(1);
  console.log("No contact details found in the built pages.");
}
