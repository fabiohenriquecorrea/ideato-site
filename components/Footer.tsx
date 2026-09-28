import { instagramDm, instagramUrl, whatsappUrl } from "@/lib/links";
import type { SiteContent } from "@/lib/types";
import { ArrowRight, ArrowUpRight } from "./Icons";
import { Mark, Wordmark } from "./Logo";
import { Media } from "./Media";
import { VariableProximity } from "./VariableProximity";

export function Footer({ content }: { content: SiteContent }) {
  const { site, contact, ui } = content;
  const year = new Date().getFullYear();
  const links = [
    { label: "Instagram", value: `@${site.instagram}`, href: instagramUrl(site.instagram) },
    site.email && { label: "E-mail", value: site.email, href: `mailto:${site.email}` },
    site.whatsapp && {
      label: "WhatsApp",
      value: "Chamar no WhatsApp",
      href: whatsappUrl(site.whatsapp),
    },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  const primary = site.whatsapp
    ? whatsappUrl(site.whatsapp)
    : instagramDm(site.instagram);

  return (
    <footer
      id="contato"
      className="site-footer on-night"
      data-night
      data-edit="contact"
      aria-labelledby="contato-title"
    >
      {contact.image && (
        <div
          className="footer-bg"
          aria-hidden="true"
          style={{ opacity: Math.min(100, Math.max(0, contact.opacity ?? 18)) / 100 }}
        >
          <Media src={contact.image} alt="" sizes="100vw" />
        </div>
      )}
      <div className="wrap">
        <div className="contact-block">
          <VariableProximity
            id="contato-title"
            className="t-display"
            rest={300}
            lines={[[{ text: contact.title1 }], [{ text: contact.title2, className: "hl" }]]}
          />
          <div className="contact-row">
            <a href={primary} target="_blank" rel="noreferrer" className="btn btn-accent">
              {contact.cta} <ArrowRight />
            </a>
            <ul className="contact-links">
              {links.map((l) => (
                <li key={l.label}>
                  <span className="label">{l.label}</span>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="arrow-link"
                  >
                    <span>{l.value}</span> <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="footer-bottom"
          data-edit="footer"
          style={{ ["--logo" as string]: Math.min(2.5, Math.max(0.5, (ui.logoScale || 100) / 100)) }}
        >
          <a href="/" className="brand" aria-label={`${site.name} — início`}>
            <Mark className="mark" />
            <Wordmark className="word" />
          </a>
          <nav aria-label="Rodapé" className="footer-nav">
            <a href="/#trabalho">{ui.footerWork}</a>
            <a href="/#estudio">{ui.footerStudio}</a>
            <a href="#" className="to-top">
              {ui.footerTop}
            </a>
          </nav>
          <span>
            © {year} {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
