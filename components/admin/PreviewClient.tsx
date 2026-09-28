"use client";

import { useEffect, useState } from "react";
import { StatusScreen } from "@/components/StatusScreen";
import { CaseView } from "@/components/views/CaseView";
import { HomeView } from "@/components/views/HomeView";
import { SiteShell } from "@/components/views/SiteShell";
import type { Snapshot } from "./store";

export type PreviewMessage = {
  type: "ideato:render";
  snap: Snapshot;
  path: string;
  screen: "maintenance" | "construction" | null;
  mediaBase?: string;
  mediaMap?: Record<string, string>;
};

/** Renderiza o rascunho recebido do editor (mesmo domínio), sem recarregar a página. */
export function PreviewClient() {
  const [msg, setMsg] = useState<PreviewMessage | null>(null);

  useEffect(() => {
    // revelações por rolagem ficam sempre visíveis na prévia
    document.documentElement.classList.remove("js");
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "ideato:render") return;
      const data = e.data as PreviewMessage;
      window.__IDEATO_MEDIA_BASE = data.mediaBase;
      window.__IDEATO_MEDIA_MAP = data.mediaMap;
      setMsg((prev) => {
        if (prev && (prev.path !== data.path || prev.screen !== data.screen)) window.scrollTo(0, 0);
        return data;
      });
    };
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "ideato:ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (msg) window.parent?.postMessage({ type: "ideato:rendered" }, window.location.origin);
  }, [msg]);

  if (!msg) return <div className="preview-wait">Carregando prévia…</div>;

  const { snap, path, screen } = msg;
  if (screen) return <StatusScreen screen={snap.status[screen]} site={snap.content.site} />;

  const slug = path.startsWith("/trabalho/") ? path.slice("/trabalho/".length) : null;
  return (
    <SiteShell content={snap.content}>
      {slug ? <CaseView content={snap.content} slug={slug} /> : <HomeView content={snap.content} />}
    </SiteShell>
  );
}
