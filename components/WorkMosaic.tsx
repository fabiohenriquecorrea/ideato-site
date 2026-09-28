"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { FRONTS, isVideo, type Front, type Work } from "@/lib/types";
import { ArrowUpRight } from "./Icons";
import { resolveMedia } from "@/lib/media-url";
import { isVimeo } from "@/lib/vimeo";
import { VimeoBackground } from "./VimeoBackground";

type Filter = "Todos" | Front;

export function WorkMosaic({ works, allLabel = "Todos" }: { works: Work[]; allLabel?: string }) {
  const [filter, setFilter] = useState<Filter>("Todos");

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: works.length };
    for (const w of works) c[w.front] = (c[w.front] ?? 0) + 1;
    return c;
  }, [works]);

  const visible = filter === "Todos" ? works : works.filter((w) => w.front === filter);
  const filters: Filter[] = ["Todos", ...FRONTS.filter((f) => counts[f])];

  const choose = (f: Filter) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) {
      doc.startViewTransition(() => flushSync(() => setFilter(f)));
    } else {
      setFilter(f);
    }
  };

  return (
    <div className="mosaic-wrap">
      <div className="mosaic-bar">
        <div className="filters" role="group" aria-label="Filtrar por frente">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="filter"
              aria-pressed={filter === f}
              onClick={() => choose(f)}
            >
              {f === "Todos" ? allLabel : f}
              <span className="count">{counts[f]}</span>
            </button>
          ))}
        </div>
        <p className="mosaic-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "projeto" : "projetos"}
        </p>
      </div>

      <ul className="mosaic">
        {visible.map((w, i) => (
          <li
            key={w.slug}
            className={`tile tile-${w.size}`}
            style={{ viewTransitionName: `tile-${w.slug}`, ["--i" as string]: i }}
          >
            <Link href={`/trabalho/${w.slug}`} className="tile-link">
              <div className="tile-media">
                {w.image &&
                  (isVimeo(w.image) ? (
                    <VimeoBackground src={w.image} title={w.alt} />
                  ) : isVideo(w.image) ? (
                    <video src={resolveMedia(w.image)} muted loop playsInline autoPlay preload="metadata" aria-hidden="true" />
                  ) : (
                    <Image
                      src={resolveMedia(w.image)}
                      alt={w.alt}
                      fill
                      sizes={w.size === "lg" || w.size === "wide" ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 25vw"}
                    />
                  ))}
              </div>
              <div className="tile-info">
                <span className="tile-front">{w.front}</span>
                <h3>{w.title}</h3>
                <p>{w.summary}</p>
              </div>
              <span className="tile-go" aria-hidden="true">
                <ArrowUpRight />
              </span>
              {w.illustrative && <span className="tile-note">ilustrativa</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
