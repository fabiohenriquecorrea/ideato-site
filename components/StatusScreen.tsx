import { instagramUrl, whatsappUrl } from "@/lib/links";
import type { StatusScreen as Screen } from "@/lib/status-types";
import type { SiteContent } from "@/lib/types";
import { ArrowRight, ArrowUpRight } from "./Icons";
import { MARK_PATH, Mark, Wordmark } from "./Logo";
import { Media } from "./Media";
import { VariableProximity } from "./VariableProximity";

/** Tela única exibida aos visitantes quando o site está em manutenção ou em construção. */
export function StatusScreen({ screen, site }: { screen: Screen; site: SiteContent["site"] }) {
  const ig = instagramUrl(site.instagram);
  const whatsapp = whatsappUrl(site.whatsapp);
  const primary = whatsapp || ig;

  return (
    <main className="status on-night" data-night>
      {screen.image && (
        <div className="status-bg" aria-hidden="true" style={{ opacity: Math.min(100, Math.max(0, screen.opacity)) / 100 }}>
          <Media src={screen.image} alt="" sizes="100vw" priority />
        </div>
      )}
      <svg className="status-lines" viewBox="-4 -4 176.69 112.31" aria-hidden="true">
        <path d={MARK_PATH} pathLength={1} />
      </svg>

      <header className="wrap status-top">
        <span className="brand" aria-label={site.name}>
          <Mark className="mark" />
          <Wordmark className="word" />
        </span>
        {screen.note && (
          <span className="status-note">
            <i aria-hidden="true" />
            {screen.note}
          </span>
        )}
      </header>

      <section className="wrap status-body" aria-labelledby="status-title">
        <VariableProximity
          as="h1"
          id="status-title"
          className="t-display"
          rest={300}
          peak={900}
          intro
          lines={[[{ text: screen.title1 }], [{ text: screen.title2, className: "hl" }]]}
        />
        {screen.text && <p className="t-lead">{screen.text}</p>}
        {screen.showContact && (
          <div className="status-actions">
            <a className="btn btn-accent" href={primary} target="_blank" rel="noreferrer">
              {whatsapp ? "Chamar no WhatsApp" : "Falar pelo Instagram"} <ArrowRight />
            </a>
            {site.email && (
              <a className="btn btn-outline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            )}
          </div>
        )}
      </section>

      <footer className="wrap status-foot">
        <a href={ig} target="_blank" rel="noreferrer" className="arrow-link">
          <span>@{site.instagram}</span> <ArrowUpRight />
        </a>
        <span>© {new Date().getFullYear()} {site.name}</span>
      </footer>
    </main>
  );
}
