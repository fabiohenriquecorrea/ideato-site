import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/Icons";
import { Media } from "@/components/Media";
import { VimeoPlayer } from "@/components/VimeoPlayer";
import type { SiteContent } from "@/lib/types";

export function CaseView({ content, slug }: { content: SiteContent; slug: string }) {
  const { works, ui } = content;
  const index = works.findIndex((w) => w.slug === slug);
  if (index === -1) return null;
  const work = works[index];
  const next = works[(index + 1) % works.length];
  const portrait = work.size === "tall";

  return (
    <article>
      <header className="wrap case-hero" data-edit={`case:${work.slug}:dados`}>
        <nav className="crumbs" aria-label="Você está em">
          <Link href="/#trabalho" className="arrow-link">
            <ArrowLeft /> <span>{ui.caseBack}</span>
          </Link>
          <span aria-hidden="true">/</span>
          <span>{work.front}</span>
        </nav>
        <div className="row">
          <h1 className="t-h1">{work.title}</h1>
          <p>{work.summary}</p>
        </div>
      </header>

      <div className="wrap" data-edit={`case:${work.slug}:dados`}>
        <figure className={`case-media ${portrait ? "is-portrait" : ""}`}>
          <div className="frame">
            <Media src={work.image} alt={work.alt} sizes="(max-width: 900px) 100vw, 80vw" priority />
          </div>
          {work.illustrative && <figcaption className="t-caption">Imagem ilustrativa</figcaption>}
        </figure>
      </div>

      {work.video && (
        <div className="wrap case-video" data-edit={`case:${work.slug}:conteudo`}>
          <VimeoPlayer src={work.video} title={`Vídeo — ${work.title}`} />
        </div>
      )}

      <section className="wrap section" aria-label="Sobre o projeto" data-edit={`case:${work.slug}:conteudo`}>
        <div className="case-body">
          <div data-reveal>
            <span className="label">Desafio</span>
            <h2>O que não funcionava</h2>
            <p>{work.challenge}</p>
          </div>
          <div data-reveal style={{ ["--d" as string]: 100 }}>
            <span className="label">Decisão</span>
            <h2>O raciocínio</h2>
            <p>{work.decision}</p>
          </div>
          <div data-reveal style={{ ["--d" as string]: 200 }}>
            <span className="label">Entrega</span>
            <h2>O que foi feito</h2>
            <ul className="checklist">
              {work.deliverables.filter(Boolean).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {works.length > 1 && (
        <div className="wrap" style={{ paddingBottom: "clamp(72px, 10vw, 144px)" }}>
          <Link href={`/trabalho/${next.slug}`} className="case-next">
            <div>
              <span className="label">
                {ui.caseNext} · {next.front}
              </span>
              <strong>{next.title}</strong>
            </div>
            <ArrowRight />
          </Link>
        </div>
      )}
    </article>
  );
}
