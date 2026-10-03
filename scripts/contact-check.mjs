import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Returns the contact-detail problems found in an HTML document.
 * Scripts and styles are ignored. Phone and email checks run on text only,
 * with tags replaced by "|" so numbers in neighbouring elements never join up.
 * @param {string} html
 * @returns {string[]}
 */
export function findProblems(html) {
  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const text = withoutCode.replace(/<[^>]+>/g, " | ");
  const problems = [];
  if (/mailto:/i.test(withoutCode)) problems.push("mailto link");
  if (/\btel:/i.test(withoutCode)) problems.push("tel link");
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
