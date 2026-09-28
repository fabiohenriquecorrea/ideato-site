"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { UiText } from "@/lib/types";
import { Mark, Wordmark } from "./Logo";

type Tone = "clear" | "paper" | "night";

export function Header({ ui }: { ui: UiText }) {
  const links = [
    { href: "/#trabalho", label: ui.navWork },
    { href: "/#estudio", label: ui.navStudio },
  ];
  const pathname = usePathname();
  const [tone, setTone] = useState<Tone>("paper");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    let raf = 0;
    const probe = 34; // meio da barra
    const update = () => {
      raf = 0;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        const r = hero.getBoundingClientRect();
        if (r.top <= probe && r.bottom > 68) return setTone("clear");
      }
      const night = Array.from(document.querySelectorAll<HTMLElement>("[data-night]")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      setTone(night ? "night" : "paper");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className="site-header"
      data-tone={open ? "paper" : tone}
      data-menu={open}
      data-edit="header"
      style={{ ["--logo" as string]: Math.min(2.5, Math.max(0.5, (ui.logoScale || 100) / 100)) }}
    >
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="Ideato Studio — início">
          <Mark className="mark" />
          <Wordmark className="word" />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <nav id="site-nav" className="site-nav" data-open={open} aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contato" className="btn btn-primary" onClick={() => setOpen(false)}>
            {ui.headerCta}
          </a>
        </nav>
      </div>
    </header>
  );
}
