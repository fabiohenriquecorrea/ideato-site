import { parseVimeo, vimeoPlayerUrl } from "@/lib/vimeo";

/** Player completo do Vimeo em 16:9. */
export function VimeoPlayer({ src, title }: { src: string; title: string }) {
  const ref = parseVimeo(src);
  if (!ref) return null;
  return (
    <div className="vimeo-player">
      <iframe
        src={vimeoPlayerUrl(ref)}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
