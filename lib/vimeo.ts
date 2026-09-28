/** Links do Vimeo: vimeo.com/123, vimeo.com/123/abc (não listado), player.vimeo.com/video/123?h=abc */
export type VimeoRef = { id: string; hash?: string };

export function parseVimeo(url: string | undefined): VimeoRef | null {
  if (!url || !/vimeo\.com/i.test(url)) return null;
  try {
    const u = new URL(url.trim());
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.findIndex((p) => /^\d+$/.test(p));
    if (i === -1) return null;
    const next = parts[i + 1];
    const hash = u.searchParams.get("h") ?? (next && /^[a-z0-9]+$/i.test(next) ? next : undefined);
    return { id: parts[i], hash };
  } catch {
    return null;
  }
}

export const isVimeo = (src: string | undefined) => Boolean(parseVimeo(src));

/** Fundo: sem som, em loop, sem controles (o recurso "background" do Vimeo). */
export function vimeoBackgroundUrl(ref: VimeoRef) {
  const q = new URLSearchParams({ background: "1", autoplay: "1", muted: "1", loop: "1", autopause: "0", dnt: "1" });
  if (ref.hash) q.set("h", ref.hash);
  return `https://player.vimeo.com/video/${ref.id}?${q}`;
}

/** Player completo, com controles e som. */
export function vimeoPlayerUrl(ref: VimeoRef) {
  const q = new URLSearchParams({ dnt: "1", title: "0", byline: "0", portrait: "0", color: "D5E538" });
  if (ref.hash) q.set("h", ref.hash);
  return `https://player.vimeo.com/video/${ref.id}?${q}`;
}
