"use client";

import { createElement, useEffect, useRef } from "react";

/**
 * Tipografia cinética de proximidade: cada letra ganha peso (eixo `wght` da
 * Bounded) conforme o cursor se aproxima. As posições das letras são medidas
 * em repouso, então a mudança de largura não realimenta o cálculo.
 */

type Line = { text: string; className?: string }[];

type Props = {
  lines: Line[];
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
  /** peso em repouso */
  rest?: number;
  /** peso máximo, sob o cursor */
  peak?: number;
  /** raio de influência, em múltiplos do tamanho da fonte */
  reach?: number;
  /** varredura automática ao entrar na tela */
  intro?: boolean;
};

export function VariableProximity({
  lines,
  as = "h2",
  id,
  className,
  rest = 380,
  peak = 900,
  reach = 2.4,
  intro = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const label = lines.map((l) => l.map((s) => s.text).join("")).join(" ");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-l]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const set = (el: HTMLElement, w: number) => {
      el.style.fontVariationSettings = `"wght" ${w.toFixed(1)}`;
    };

    if (reduce) {
      letters.forEach((el) => set(el, rest));
      return;
    }

    const n = letters.length;
    const cx = new Float32Array(n);
    const cy = new Float32Array(n);
    const current = new Float32Array(n).fill(rest);
    const target = new Float32Array(n).fill(rest);
    let radius = 200;
    let pointer: { x: number; y: number } | null = null;
    let sweep: { x: number; y: number } | null = null;
    let visible = false;
    let raf = 0;

    const measure = () => {
      letters.forEach((el) => set(el, rest));
      const box = root.getBoundingClientRect();
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        cx[i] = r.left - box.left + r.width / 2;
        cy[i] = r.top - box.top + r.height / 2;
        current[i] = rest;
      });
      radius = parseFloat(getComputedStyle(root).fontSize) * reach;
    };

    const tick = () => {
      raf = 0;
      const box = root.getBoundingClientRect();
      const p = sweep ?? pointer;
      let moving = false;
      for (let i = 0; i < n; i++) {
        let t = 0;
        if (p) {
          const dx = p.x - (box.left + cx[i]);
          const dy = p.y - (box.top + cy[i]);
          const d = Math.sqrt(dx * dx + dy * dy);
          t = Math.max(0, 1 - d / radius);
          t = t * t * (3 - 2 * t);
        }
        target[i] = rest + (peak - rest) * t;
        const next = current[i] + (target[i] - current[i]) * 0.16;
        current[i] = Math.abs(target[i] - next) < 0.5 ? target[i] : next;
        if (current[i] !== target[i]) moving = true;
        set(letters[i], current[i]);
      }
      if (moving || sweep) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      kick();
    };
    const onLeave = () => {
      pointer = null;
      kick();
    };

    const runSweep = () => {
      const box = root.getBoundingClientRect();
      const start = performance.now();
      const duration = 1600;
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / duration);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        const b = root.getBoundingClientRect();
        sweep = {
          x: b.left - radius + (box.width + radius * 2) * e,
          y: b.top + box.height * (0.25 + 0.5 * e),
        };
        kick();
        if (k < 1) requestAnimationFrame(step);
        else {
          sweep = null;
          kick();
        }
      };
      requestAnimationFrame(step);
    };

    let swept = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        kick();
        if (intro && !swept) {
          swept = true;
          runSweep();
        }
      }
    });

    const ro = new ResizeObserver(() => measure());

    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      measure();
      ro.observe(root);
      io.observe(root);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    });

    return () => {
      alive = false;
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [rest, peak, reach, intro, label]);

  return createElement(
    as,
    {
      ref,
      id,
      className: `vp ${className ?? ""}`,
      "aria-label": label,
      style: { ["--vp-rest" as string]: rest },
    },
    lines.map((line, li) => (
      <span className="vp-line" aria-hidden="true" key={li}>
        {line.map((seg, si) =>
          seg.text.split(/(\s+)/).map((word, wi) =>
            /^\s+$/.test(word) || word === "" ? (
              word
            ) : (
              <span className={`vp-word ${seg.className ?? ""}`} key={`${si}-${wi}`}>
                {Array.from(word).map((ch, ci) => (
                  <span data-l key={ci}>
                    {ch}
                  </span>
                ))}
              </span>
            ),
          ),
        )}
      </span>
    )),
  );
}
