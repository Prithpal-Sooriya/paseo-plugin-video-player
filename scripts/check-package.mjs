// Verifies the manifest and that the packed plugin contains everything Paseo needs.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("paseo-plugin.json", "utf8"));
const fail = (message) => {
  console.error(`check:package: ${message}`);
  process.exit(1);
};

if (!/^[a-z][a-z0-9-]*$/.test(manifest.id ?? "")) fail("manifest id is missing or invalid");
if (!manifest.requirements?.paseo) fail("manifest requirements.paseo is missing");

const [pack] = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { encoding: "utf8" }),
);
const files = new Set(pack.files.map((file) => file.path));
const required = ["paseo-plugin.json", "OVERVIEW.md", "index.client.tsx", ...(manifest.media ?? [])];
if (manifest.icon) required.push(manifest.icon);
const missing = required.filter((file) => !/^https:/.test(file) && !files.has(file));
if (missing.length) fail(`package is missing: ${missing.join(", ")}`);

const overview = readFileSync("OVERVIEW.md", "utf8");
if (/paseo plugin add|npm install|npm i\b/.test(overview)) {
  fail("OVERVIEW.md must not contain install commands (registry validator rejects them)");
}

console.log(`check:package: ok (${files.size} files, ${pack.version})`);
