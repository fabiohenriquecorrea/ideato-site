import "server-only";
import { readFileSync } from "fs";
import path from "path";
import { STATUS_DEFAULTS, type SiteStatus } from "./status-types";
import { UI_DEFAULTS, type SiteContent } from "./types";

// Lido na hora de gerar o site. O painel altera estes arquivos no GitHub
// e a Cloudflare gera o site de novo.
const DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "content");

export function normalizeContent(data: SiteContent): SiteContent {
  return { ...data, ui: { ...UI_DEFAULTS, ...(data.ui ?? {}) } };
}

export function normalizeStatus(data: Partial<SiteStatus> | null): SiteStatus {
  return {
    mode: data?.mode ?? STATUS_DEFAULTS.mode,
    maintenance: { ...STATUS_DEFAULTS.maintenance, ...(data?.maintenance ?? {}) },
    construction: { ...STATUS_DEFAULTS.construction, ...(data?.construction ?? {}) },
  };
}

export function getContent(): SiteContent {
  return normalizeContent(JSON.parse(readFileSync(path.join(DIR, "site.json"), "utf8")));
}

export function getStatus(): SiteStatus {
  try {
    return normalizeStatus(JSON.parse(readFileSync(path.join(DIR, "status.json"), "utf8")));
  } catch {
    return normalizeStatus(null);
  }
}
