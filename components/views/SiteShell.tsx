import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/RevealObserver";
import type { SiteContent } from "@/lib/types";

/** Topo + conteúdo + rodapé, igual no site publicado e na prévia do editor. */
export function SiteShell({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header ui={content.ui} />
      <main id="conteudo">{children}</main>
      <Footer content={content} />
      <RevealObserver />
    </>
  );
}
