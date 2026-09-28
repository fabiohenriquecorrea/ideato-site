import { parseVimeo, vimeoBackgroundUrl } from "@/lib/vimeo";

/** Vídeo do Vimeo como fundo, cobrindo o contêiner (como object-fit: cover). */
export function VimeoBackground({ src, title }: { src: string; title?: string }) {
  const ref = parseVimeo(src);
  if (!ref) return null;
  return (
    <div className="vimeo-bg">
      <iframe
        src={vimeoBackgroundUrl(ref)}
        title={title || "Vídeo"}
        allow="autoplay; fullscreen; picture-in-picture"
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
