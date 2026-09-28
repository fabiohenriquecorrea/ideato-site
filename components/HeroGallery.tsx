"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Slide } from "@/lib/types";
import { resolveMedia } from "@/lib/media-url";

type Props = { slides: Slide[]; interval: number };

/** Fundo do hero: troca imagens/vídeos sozinho, em crossfade. */
export function HeroGallery({ slides, interval }: Props) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const [reduce, setReduce] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const count = slides.length;
  const paused = hidden || reduce || count < 2;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(([e]) => setHidden(!e.isIntersecting || document.hidden));
    if (figureRef.current) io.observe(figureRef.current);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, []);

  // Avança sozinho; pausa fora da tela, com a aba escondida ou com movimento reduzido
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => {
      setPrev(index);
      setIndex((index + 1) % count);
    }, interval * 1000);
    return () => window.clearTimeout(id);
  }, [index, paused, interval, count]);

  // Só o vídeo ativo toca
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && !hidden) v.play().catch(() => {});
      else v.pause();
    });
  }, [index, hidden]);

  if (!count) return null;

  return (
    <figure ref={figureRef} className="hero-figure" aria-hidden="true">
      <div className="frame">
        {slides.map((s, i) => {
          const state = i === index ? "active" : i === prev ? "leaving" : "idle";
          return (
            <div
              key={`${s.src}-${i}`}
              className="slide"
              data-state={state}
              onTransitionEnd={() => i === prev && setPrev(null)}
            >
              {s.type === "video" ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={resolveMedia(s.src)}
                  poster={s.poster && resolveMedia(s.poster)}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                />
              ) : (
                <Image
                  src={resolveMedia(s.src)}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                />
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
