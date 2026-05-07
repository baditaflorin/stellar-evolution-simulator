import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const docsDir = "docs";
const directPaths = [
  "assets",
  "index.html",
  "404.html",
  "manifest.webmanifest",
  "registerSW.js",
  "sw.js",
  "sw.js.map",
  "version.json",
  "favicon.svg",
  "icon.svg",
  "maskable-icon.svg",
];

for (const relativePath of directPaths) {
  const target = join(docsDir, relativePath);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
}

if (existsSync(docsDir)) {
  for (const entry of readdirSync(docsDir)) {
    if (entry.startsWith("workbox-") && /^workbox-.+\.js(\.map)?$/.test(entry)) {
      rmSync(join(docsDir, entry), { force: true });
    }
  }
}
