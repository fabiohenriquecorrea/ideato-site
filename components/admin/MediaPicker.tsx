"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { isVideo } from "@/lib/types";
import { isVimeo, parseVimeo } from "@/lib/vimeo";
import { MAX_UPLOAD_MB, type MediaItem, type Store } from "./store";

export const MediaContext = createContext<{ store: Store; onUploaded: () => void } | null>(null);
const useMedia = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("MediaContext ausente");
  return ctx;
};

const vimeoThumbs = new Map<string, Promise<string | null>>();
function vimeoThumb(src: string) {
  if (!vimeoThumbs.has(src)) {
    vimeoThumbs.set(
      src,
      fetch(`https://vimeo.com/api/oembed.json?width=320&url=${encodeURIComponent(src)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.thumbnail_url ?? null)
        .catch(() => null),
    );
  }
  return vimeoThumbs.get(src)!;
}

function VimeoThumb({ src, className }: { src: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    vimeoThumb(src).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [src]);
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`ed-thumb ${className ?? ""}`} src={url} alt="" loading="lazy" />
  ) : (
    <span className={`ed-thumb is-vimeo ${className ?? ""}`} aria-hidden="true">
      Vimeo
    </span>
  );
}

export function Thumb({ src, className }: { src?: string; className?: string }) {
  const ctx = useContext(MediaContext);
  if (!src) return <span className={`ed-thumb is-empty ${className ?? ""}`} aria-hidden="true" />;
  if (isVimeo(src)) return <VimeoThumb src={src} className={className} />;
  const url = ctx ? ctx.store.mediaUrl(src) : src;
  return isVideo(src) ? (
    <video className={`ed-thumb ${className ?? ""}`} src={url} muted preload="metadata" aria-hidden="true" />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`ed-thumb ${className ?? ""}`} src={url} alt="" loading="lazy" />
  );
}

export function MediaPicker({
  current,
  onPick,
  onClose,
}: {
  current?: string;
  onPick: (src: string) => void;
  onClose: () => void;
}) {
  const { store, onUploaded } = useMedia();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      setItems(await store.listMedia());
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : "Não foi possível listar os arquivos.");
    }
  }, [store]);

  useEffect(() => {
    load();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [load, onClose]);

  async function upload(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files);
    setUploading(list.length);
    let last: string | null = null;
    for (const file of list) {
      try {
        last = await store.upload(file);
        onUploaded();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha no envio.");
      }
      setUploading((n) => n - 1);
    }
    await load();
    if (last && list.length === 1) onPick(last);
  }

  const shown = (items ?? []).filter((it) => {
    if (kind === "image" && isVideo(it.src)) return false;
    if (kind === "video" && !isVideo(it.src)) return false;
    return !query || it.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="ed-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="ed-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Biblioteca de mídia"
        tabIndex={-1}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => e.currentTarget === e.target && setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
        }}
      >
        <header className="ed-modal-head">
          <h2>Biblioteca de mídia</h2>
          <button type="button" className="ed-icon-btn" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </header>

        <div className="ed-modal-tools">
          <input
            type="search"
            className="ed-input"
            placeholder="Buscar pelo nome do arquivo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="ed-seg" role="group" aria-label="Tipo">
            {(["all", "image", "video"] as const).map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {k === "all" ? "Tudo" : k === "image" ? "Imagens" : "Vídeos"}
              </button>
            ))}
          </div>
          <button type="button" className="ed-btn ed-btn-primary" onClick={() => inputRef.current?.click()}>
            Enviar arquivo
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            hidden
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
        </div>

        {(uploading > 0 || error) && (
          <p className={`ed-modal-status ${error ? "is-error" : ""}`} role="status">
            {error ?? `Enviando ${uploading} arquivo${uploading > 1 ? "s" : ""}…`}
          </p>
        )}

        <div className={`ed-library ${drag ? "is-drag" : ""}`}>
          {items === null ? (
            <p className="ed-empty">Carregando…</p>
          ) : shown.length === 0 ? (
            <p className="ed-empty">
              Nada por aqui. Arraste arquivos para esta janela ou use “Enviar arquivo” (até {MAX_UPLOAD_MB} MB).
            </p>
          ) : (
            shown.map((it) => (
              <button
                key={it.src}
                type="button"
                className="ed-lib-item"
                aria-pressed={it.src === current}
                onClick={() => onPick(it.src)}
                title={it.name}
              >
                <Thumb src={it.src} />
                <span className="ed-lib-name">{it.name}</span>
                {isVideo(it.src) && <span className="ed-lib-badge">vídeo</span>}
              </button>
            ))
          )}
          {drag && <div className="ed-drop">Solte para enviar</div>}
        </div>
      </div>
    </div>
  );
}
