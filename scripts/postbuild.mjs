import { execSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const commit = execSync("git rev-parse --short HEAD", {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
}).trim();

copyFileSync("docs/index.html", "docs/404.html");
writeFileSync("docs/.nojekyll", "\n");
writeFileSync(
  "docs/version.json",
  `${JSON.stringify(
    {
      version: packageJson.version,
      commit,
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);
