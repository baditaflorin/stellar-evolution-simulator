import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const releaseInfo = JSON.parse(readFileSync("release.json", "utf8"));

copyFileSync("docs/index.html", "docs/404.html");
writeFileSync("docs/.nojekyll", "\n");
writeFileSync(
  "docs/version.json",
  `${JSON.stringify(
    {
      version: packageJson.version,
      commit: process.env.VITE_COMMIT_SHA ?? releaseInfo.commit,
    },
    null,
    2,
  )}\n`,
);
