/**
 * Skyvern-style smoke scope: classify git diff into Frontend / Backend / Mixed
 * and decide which automated checks to run (narrow vs full browser QA).
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

export type DiffClassification = "Frontend" | "Backend" | "Mixed" | "None";

export interface QaClassification {
  classification: DiffClassification;
  changedFiles: string[];
  needsFrontendSmoke: boolean;
  needsBackendSmoke: boolean;
  /** True when only non-app paths changed (e.g. markdown-only). */
  docsOnly: boolean;
}

function classifyPaths(files: string[]): Omit<QaClassification, "changedFiles"> {
  if (files.length === 0) {
    return {
      classification: "Mixed",
      needsFrontendSmoke: true,
      needsBackendSmoke: true,
      docsOnly: false,
    };
  }

  let frontend = false;
  let backend = false;
  let docsOnly = true;

  for (const f of files) {
    const isDoc =
      f.endsWith(".md") ||
      f.startsWith(".github/") ||
      f === "LICENSE" ||
      f.startsWith("docs/");
    if (!isDoc) {
      docsOnly = false;
    }

    if (f.startsWith("webview-ui/")) {
      frontend = true;
    } else if (
      f.startsWith("server/") ||
      f.startsWith("scripts/") ||
      f.startsWith("tests/") ||
      f === "package.json" ||
      f === "package-lock.json" ||
      f === "playwright.config.ts" ||
      f === "tsconfig.json"
    ) {
      backend = true;
    } else if (!f.includes("/")) {
      backend = true;
    }
  }

  let classification: DiffClassification = "None";
  if (frontend && backend) classification = "Mixed";
  else if (frontend) classification = "Frontend";
  else if (backend) classification = "Backend";

  if (docsOnly) {
    return {
      classification: "None",
      needsFrontendSmoke: false,
      needsBackendSmoke: false,
      docsOnly: true,
    };
  }

  const needsFrontendSmoke = frontend || classification === "Mixed" || (!frontend && !backend);
  const needsBackendSmoke = backend || classification === "Mixed" || (!frontend && !backend);

  return {
    classification,
    needsFrontendSmoke,
    needsBackendSmoke,
    docsOnly: false,
  };
}

function listChangedFiles(base: string, head: string): string[] {
  const invalidBase = !base || /^0+$/.test(base);
  const range = invalidBase ? head : `${base}...${head}`;
  try {
    const out = execSync(`git diff --name-only ${range}`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return out
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function main(): void {
  const base = process.env.QA_BASE_SHA ?? process.env.QA_BASE_REF ?? "origin/main";
  const head = process.env.QA_HEAD_SHA ?? process.env.QA_HEAD_REF ?? "HEAD";
  const changedFiles = listChangedFiles(base, head);
  const rest = classifyPaths(changedFiles);
  const result: QaClassification = { changedFiles, ...rest };

  const outPath = process.env.QA_CLASSIFICATION_FILE ?? "qa-classification.json";
  writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");

  // Machine-readable line for logs / copy-paste
  console.log(
    JSON.stringify({
      classification: result.classification,
      needsFrontendSmoke: result.needsFrontendSmoke,
      needsBackendSmoke: result.needsBackendSmoke,
      docsOnly: result.docsOnly,
      fileCount: changedFiles.length,
    }),
  );
}

main();
