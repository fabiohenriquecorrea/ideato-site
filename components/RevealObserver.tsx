"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Marca `[data-reveal]` e `[data-observe]` com `.is-in` ao entrar na tela, uma vez. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal], [data-observe]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));

    // Parallax leve na faixa da cidade
    const band = document.querySelector<HTMLElement>("[data-parallax]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onScroll = () => {
      if (!band || reduce) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = band.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        const img = band.querySelector<HTMLElement>("img");
        if (img) img.style.transform = `translate3d(0, ${(progress * 6).toFixed(2)}%, 0)`;
      });
    };
    if (band && !reduce) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
