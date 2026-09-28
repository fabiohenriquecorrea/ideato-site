import Image from "next/image";
import { isVideo } from "@/lib/types";
import { resolveMedia } from "@/lib/media-url";
import { isVimeo } from "@/lib/vimeo";
import { VimeoBackground } from "./VimeoBackground";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  poster?: string;
  className?: string;
};

/** Imagem ou vídeo, preenchendo o contêiner (que precisa de position: relative). */
export function Media({ src, alt, sizes, priority, poster, className }: Props) {
  if (!src) return <div className={`media-empty ${className ?? ""}`} aria-hidden="true" />;
  if (isVimeo(src)) return <VimeoBackground src={src} title={alt} />;
  if (isVideo(src)) {
    return (
      <video
        className={`media-fill ${className ?? ""}`}
        src={resolveMedia(src)}
        poster={poster && resolveMedia(poster)}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  return (
    <Image
      className={className}
      src={resolveMedia(src)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
    />
  );
}
