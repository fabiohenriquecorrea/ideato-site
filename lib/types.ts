export type Front = "Marca" | "Social" | "Imagem" | "Site";
export const FRONTS: Front[] = ["Marca", "Social", "Imagem", "Site"];

export type TileSize = "sm" | "tall" | "wide" | "lg";

export type Slide = {
  type: "image" | "video";
  src: string;
  /** imagem exibida enquanto o vídeo carrega */
  poster?: string;
  alt: string;
  label: string;
};

export type Work = {
  slug: string;
  front: Front;
  title: string;
  summary: string;
  image: string;
  alt: string;
  size: TileSize;
  illustrative: boolean;
  challenge: string;
  decision: string;
  deliverables: string[];
  /** link do Vimeo com o vídeo completo do projeto (opcional) */
  video?: string;
};

export type UiText = {
  /** tamanho da logo em % (100 = padrão) */
  logoScale: number;
  navWork: string;
  navStudio: string;
  headerCta: string;
  filterAll: string;
  caseBack: string;
  caseNext: string;
  footerWork: string;
  footerStudio: string;
  footerTop: string;
};

export const UI_DEFAULTS: UiText = {
  logoScale: 100,
  navWork: "Trabalho",
  navStudio: "Estúdio",
  headerCta: "Falar com o estúdio",
  filterAll: "Todos",
  caseBack: "Trabalho",
  caseNext: "Próximo projeto",
  footerWork: "Trabalho",
  footerStudio: "Estúdio",
  footerTop: "Voltar ao topo",
};

export type SiteContent = {
  ui: UiText;
  site: {
    name: string;
    base: string;
    lead: string;
    /** sem @ */
    instagram: string;
    email: string;
    /** só números com DDI, ex.: 5544999999999 */
    whatsapp: string;
    seoTitle: string;
    seoDescription: string;
  };
  home: {
    hero: {
      title1: string;
      title2: string;
      lead: string;
      ctaPrimary: string;
      ctaSecondary: string;
      /** segundos por slide */
      interval: number;
      slides: Slide[];
    };
    work: { title1: string; title2: string; intro: string };
    band: { title1: string; title2: string; text: string; image: string; alt: string };
    studio: {
      title1: string;
      title2: string;
      lead: string;
      body: string;
      quote: string;
      quoteAuthor: string;
      image: string;
      alt: string;
      caption: string;
    };
  };
  contact: {
    title1: string;
    title2: string;
    cta: string;
    image: string;
    /** 0–100 */
    opacity: number;
  };
  works: Work[];
};

export const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src);
