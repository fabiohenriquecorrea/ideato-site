import { ArrowRight, ArrowUpRight } from "@/components/Icons";
import { HeroGallery } from "@/components/HeroGallery";
import { MARK_PATH } from "@/components/Logo";
import { Media } from "@/components/Media";
import { VariableProximity } from "@/components/VariableProximity";
import { WorkMosaic } from "@/components/WorkMosaic";
import { instagramUrl } from "@/lib/links";
import type { SiteContent } from "@/lib/types";

export function HomeView({ content }: { content: SiteContent }) {
  const { site, home, works, ui } = content;
  const { hero, work, band, studio } = home;
  const igUrl = instagramUrl(site.instagram);

  return (
    <>
      {/* ── Hero ───────────────────────────── */}
      <section
        id="inicio"
        className="hero on-night"
        data-hero
        data-night
        data-edit="hero"
        aria-labelledby="hero-title"
      >
        <svg
          className="hero-lines"
          viewBox="-4 -4 176.69 112.31"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={MARK_PATH} pathLength={1} />
        </svg>

        <div className="wrap hero-grid">
          <div className="hero-copy">
            <VariableProximity
              as="h1"
              id="hero-title"
              className="t-display"
              rest={300}
              peak={900}
              intro
              lines={[[{ text: hero.title1 }], [{ text: hero.title2, className: "hl" }]]}
            />
            <p className="t-lead">{hero.lead}</p>
            <div className="hero-actions">
              <a href="#contato" className="btn btn-accent">
                {hero.ctaPrimary} <ArrowRight />
              </a>
              <a href="#trabalho" className="btn btn-outline">
                {hero.ctaSecondary}
              </a>
            </div>
          </div>

          <HeroGallery slides={hero.slides} interval={Math.max(2, hero.interval || 6)} />
        </div>
      </section>

      {/* ── Trabalho ───────────────────────── */}
      <section id="trabalho" className="section" data-edit="work" aria-labelledby="trabalho-title">
        <div className="wrap">
          <div className="section-head">
            <VariableProximity
              id="trabalho-title"
              className="t-h1"
              lines={[[{ text: work.title1 }], [{ text: work.title2 }]]}
            />
            <p>{work.intro}</p>
          </div>
          <WorkMosaic works={works} allLabel={ui.filterAll} />
        </div>
      </section>

      {/* ── Faixa ──────────────────────────── */}
      <section
        id="faixa"
        className="band"
        data-parallax
        data-night
        data-edit="band"
        aria-labelledby="band-title"
      >
        <Media src={band.image} alt={band.alt} sizes="100vw" />
        <div className="wrap">
          <VariableProximity
            id="band-title"
            className="t-h1"
            rest={420}
            lines={[[{ text: band.title1 }], [{ text: band.title2 }]]}
          />
          <p>{band.text}</p>
        </div>
      </section>

      {/* ── Estúdio ────────────────────────── */}
      <section id="estudio" className="section" data-edit="studio" aria-labelledby="estudio-title">
        <div className="wrap studio">
          <figure className="studio-figure">
            <div className="frame">
              <Media src={studio.image} alt={studio.alt} sizes="(max-width: 900px) 440px, 36vw" />
            </div>
            {studio.caption && <figcaption className="t-caption">{studio.caption}</figcaption>}
          </figure>

          <div className="studio-copy">
            <VariableProximity
              id="estudio-title"
              className="t-h1"
              lines={[[{ text: studio.title1 }], [{ text: studio.title2 }]]}
            />
            <p className="t-lead">{studio.lead}</p>
            <p className="t-body">{studio.body}</p>

            {studio.quote && (
              <blockquote className="quote">
                <p>“{studio.quote}”</p>
                {studio.quoteAuthor && <footer className="t-caption">— {studio.quoteAuthor}</footer>}
              </blockquote>
            )}

            <dl className="facts">
              <div>
                <dt className="label">Responsável</dt>
                <dd>{site.lead}</dd>
              </div>
              <div>
                <dt className="label">Base</dt>
                <dd>{site.base}</dd>
              </div>
              <div>
                <dt className="label">Instagram</dt>
                <dd>
                  <a href={igUrl} target="_blank" rel="noreferrer" className="arrow-link">
                    <span>@{site.instagram}</span> <ArrowUpRight />
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
