import type { Metadata } from "next";
import { StatusScreen } from "@/components/StatusScreen";
import { SiteShell } from "@/components/views/SiteShell";
import { getContent, getStatus } from "@/lib/content";

export function generateMetadata(): Metadata {
  // fora do ar: não indexar a tela temporária
  return getStatus().mode === "online" ? {} : { robots: { index: false, follow: false } };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = getContent();
  const status = getStatus();
  if (status.mode !== "online") return <StatusScreen screen={status[status.mode]} site={content.site} />;
  return <SiteShell content={content}>{children}</SiteShell>;
}
