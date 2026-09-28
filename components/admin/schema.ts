import { FRONTS, type SiteContent, type Slide, type Work } from "@/lib/types";

export type Field =
  | { kind: "text"; key: string; label: string; hint?: string; placeholder?: string }
  | { kind: "textarea"; key: string; label: string; hint?: string; rows?: number }
  | { kind: "number"; key: string; label: string; min: number; max: number; suffix?: string; hint?: string }
  | { kind: "range"; key: string; label: string; min: number; max: number; suffix?: string; hint?: string }
  | { kind: "media"; key: string; label: string; hint?: string }
  | { kind: "vimeo"; key: string; label: string; hint?: string }
  | { kind: "select"; key: string; label: string; options: { value: string; label: string }[]; hint?: string }
  | { kind: "toggle"; key: string; label: string; hint?: string }
  | { kind: "strings"; key: string; label: string; addLabel: string; hint?: string }
  | {
      kind: "list";
      key: string;
      label: string;
      addLabel: string;
      itemTitle: (item: Record<string, unknown>, i: number) => string;
      itemMedia?: (item: Record<string, unknown>) => string | undefined;
      fields: Field[];
      create: () => Record<string, unknown>;
      hint?: string;
    }
  | { kind: "works" };

export type Section = {
  id: string;
  label: string;
  /** âncora visível no site (#id) */
  anchor?: string;
  /** valor de data-edit no site, para seleção por clique e rolagem */
  target?: string;
  /** caminho no conteúdo, ex.: "home.hero" ou "works.2" */
  root: string;
  fields: Field[];
  global?: boolean;
  note?: string;
};

export type Page = {
  id: string;
  label: string;
  url: string;
  group: "pages" | "cases" | "settings";
  sections: Section[];
};

const heroSlideFields: Field[] = [
  {
    kind: "select",
    key: "type",
    label: "Tipo",
    options: [
      { value: "image", label: "Imagem" },
      { value: "video", label: "Vídeo" },
    ],
  },
  { kind: "media", key: "src", label: "Arquivo", hint: "Para vídeo, prefira um link do Vimeo: toca sem som, em loop, sem pesar o site." },
  { kind: "media", key: "poster", label: "Capa do vídeo", hint: "Imagem que aparece enquanto o vídeo carrega. Só para vídeo." },
  { kind: "text", key: "label", label: "Nome interno", hint: "Só para você identificar o slide aqui no editor." },
  { kind: "text", key: "alt", label: "Descrição (acessibilidade)", hint: "Descreva a imagem para quem usa leitor de tela." },
];

const contactSection: Section = {
  id: "contact",
  label: "Contato",
  anchor: "contato",
  target: "contact",
  root: "contact",
  global: true,
  note: "Aparece no fim de todas as páginas.",
  fields: [
    { kind: "text", key: "title1", label: "Título — linha 1" },
    { kind: "text", key: "title2", label: "Título — linha 2 (em lima)" },
    { kind: "text", key: "cta", label: "Texto do botão", hint: "Abre o WhatsApp se estiver configurado; senão, o direct do Instagram." },
    { kind: "media", key: "image", label: "Imagem de fundo" },
    { kind: "range", key: "opacity", label: "Opacidade do fundo", min: 0, max: 60, suffix: "%" },
  ],
};

export function buildPages(content: SiteContent): Page[] {
  const home: Page = {
    id: "home",
    label: "Início",
    url: "/",
    group: "pages",
    sections: [
      {
        id: "hero",
        label: "Hero",
        anchor: "inicio",
        target: "hero",
        root: "home.hero",
        fields: [
          { kind: "text", key: "title1", label: "Título — linha 1" },
          { kind: "text", key: "title2", label: "Título — linha 2 (em lima)" },
          { kind: "textarea", key: "lead", label: "Texto de apoio", rows: 3 },
          { kind: "text", key: "ctaPrimary", label: "Botão principal" },
          { kind: "text", key: "ctaSecondary", label: "Botão secundário" },
          { kind: "number", key: "interval", label: "Tempo por slide", min: 2, max: 20, suffix: "s" },
          {
            kind: "list",
            key: "slides",
            label: "Galeria",
            addLabel: "Adicionar slide",
            hint: "Arraste a ordem com as setas. Vídeos tocam sem som, em loop.",
            itemTitle: (s, i) => `${String(i + 1).padStart(2, "0")} · ${(s as Slide).label || "Sem rótulo"}`,
            itemMedia: (s) => ((s as Slide).type === "video" ? (s as Slide).poster || (s as Slide).src : (s as Slide).src),
            fields: heroSlideFields,
            create: () => ({ type: "image", src: "", alt: "", label: "Novo slide" }),
          },
        ],
      },
      {
        id: "work",
        label: "Trabalho",
        anchor: "trabalho",
        target: "work",
        root: "home.work",
        fields: [
          { kind: "text", key: "title1", label: "Título — linha 1" },
          { kind: "text", key: "title2", label: "Título — linha 2" },
          { kind: "textarea", key: "intro", label: "Introdução", rows: 3 },
          { kind: "works" },
        ],
      },
      {
        id: "band",
        label: "Faixa",
        anchor: "faixa",
        target: "band",
        root: "home.band",
        fields: [
          { kind: "text", key: "title1", label: "Título — linha 1" },
          { kind: "text", key: "title2", label: "Título — linha 2" },
          { kind: "textarea", key: "text", label: "Texto", rows: 3 },
          { kind: "media", key: "image", label: "Imagem de fundo" },
          { kind: "text", key: "alt", label: "Descrição (acessibilidade)" },
        ],
      },
      {
        id: "studio",
        label: "Estúdio",
        anchor: "estudio",
        target: "studio",
        root: "home.studio",
        fields: [
          { kind: "text", key: "title1", label: "Título — linha 1" },
          { kind: "text", key: "title2", label: "Título — linha 2" },
          { kind: "textarea", key: "lead", label: "Destaque", rows: 3 },
          { kind: "textarea", key: "body", label: "Texto", rows: 6 },
          { kind: "textarea", key: "quote", label: "Citação", rows: 2, hint: "Deixe vazio para esconder." },
          { kind: "text", key: "quoteAuthor", label: "Autor da citação" },
          { kind: "media", key: "image", label: "Imagem" },
          { kind: "text", key: "alt", label: "Descrição (acessibilidade)" },
          { kind: "text", key: "caption", label: "Legenda" },
        ],
      },
      contactSection,
    ],
  };

  const cases: Page[] = content.works.map((w: Work, i) => ({
    id: `case:${i}`,
    label: w.title || "Projeto sem título",
    url: `/trabalho/${w.slug}`,
    group: "cases",
    sections: [
      {
        id: "dados",
        label: "Capa",
        target: `case:${w.slug}:dados`,
        root: `works.${i}`,
        fields: [
          { kind: "text", key: "title", label: "Título" },
          { kind: "textarea", key: "summary", label: "Resumo", rows: 3, hint: "Aparece no mosaico e no topo do projeto." },
          {
            kind: "select",
            key: "front",
            label: "Frente",
            options: FRONTS.map((f) => ({ value: f, label: f })),
          },
          { kind: "media", key: "image", label: "Imagem de capa" },
          { kind: "text", key: "alt", label: "Descrição (acessibilidade)" },
          {
            kind: "select",
            key: "size",
            label: "Tamanho no mosaico",
            options: [
              { value: "sm", label: "Pequeno (1×1)" },
              { value: "tall", label: "Vertical (1×2)" },
              { value: "wide", label: "Horizontal (2×1)" },
              { value: "lg", label: "Destaque (2×2)" },
            ],
          },
          { kind: "toggle", key: "illustrative", label: "Marcar como imagem ilustrativa" },
          { kind: "text", key: "slug", label: "Endereço", hint: "Ex.: marca-em-escala → /trabalho/marca-em-escala" },
        ],
      },
      {
        id: "conteudo",
        label: "Conteúdo",
        target: `case:${w.slug}:conteudo`,
        root: `works.${i}`,
        fields: [
          { kind: "textarea", key: "challenge", label: "Desafio", rows: 4 },
          { kind: "textarea", key: "decision", label: "Decisão", rows: 4 },
          {
            kind: "vimeo",
            key: "video",
            label: "Vídeo do projeto (Vimeo)",
            hint: "Cole o link do vídeo no Vimeo. Aparece com play, som e tela cheia na página do projeto. Vazio = sem vídeo.",
          },
          { kind: "strings", key: "deliverables", label: "Entregas", addLabel: "Adicionar entrega" },
        ],
      },
      contactSection,
    ],
  }));

  const settings: Page = {
    id: "settings",
    label: "Configurações do site",
    url: "/",
    group: "settings",
    sections: [
      {
        id: "brand",
        label: "Logo e menu",
        target: "header",
        root: "ui",
        note: "Aparece no topo de todas as páginas.",
        fields: [
          { kind: "range", key: "logoScale", label: "Tamanho da logo", min: 60, max: 200, suffix: "%", hint: "100% é o tamanho padrão. Vale para o topo e o rodapé." },
          { kind: "text", key: "navWork", label: "Link do menu — Trabalho" },
          { kind: "text", key: "navStudio", label: "Link do menu — Estúdio" },
          { kind: "text", key: "headerCta", label: "Botão do menu" },
        ],
      },
      {
        id: "buttons",
        label: "Botões e links",
        target: "footer",
        root: "ui",
        note: "Textos de botões que se repetem pelo site. Os botões do hero e do contato ficam nas próprias seções.",
        fields: [
          { kind: "text", key: "filterAll", label: "Filtro do mosaico — mostrar todos" },
          { kind: "text", key: "caseBack", label: "Projeto — voltar" },
          { kind: "text", key: "caseNext", label: "Projeto — próximo" },
          { kind: "text", key: "footerWork", label: "Rodapé — Trabalho" },
          { kind: "text", key: "footerStudio", label: "Rodapé — Estúdio" },
          { kind: "text", key: "footerTop", label: "Rodapé — voltar ao topo" },
        ],
      },
      {
        id: "info",
        label: "Contato e redes",
        target: "contact",
        root: "site",
        fields: [
          { kind: "text", key: "name", label: "Nome do estúdio" },
          { kind: "text", key: "lead", label: "Responsável" },
          { kind: "text", key: "base", label: "Base", placeholder: "Cidade · UF" },
          { kind: "text", key: "instagram", label: "Instagram", hint: "Só o usuário, sem @." },
          { kind: "text", key: "email", label: "E-mail", hint: "Vazio = não aparece." },
          { kind: "text", key: "whatsapp", label: "WhatsApp", placeholder: "5544999999999", hint: "Com DDI e DDD. Vazio = não aparece." },
        ],
      },
      {
        id: "seo",
        label: "Busca e compartilhamento",
        root: "site",
        fields: [
          { kind: "text", key: "seoTitle", label: "Título da página", hint: "Aparece na aba e no Google. Ideal: até 60 caracteres." },
          { kind: "textarea", key: "seoDescription", label: "Descrição", rows: 3, hint: "Ideal: até 155 caracteres." },
        ],
      },
    ],
  };

  return [home, ...cases, settings];
}

export function newWork(): Work {
  return {
    slug: `novo-projeto-${Date.now().toString(36)}`,
    front: "Marca",
    title: "Novo projeto",
    summary: "",
    image: "",
    alt: "",
    size: "sm",
    illustrative: false,
    challenge: "",
    decision: "",
    deliverables: [],
  };
}

/* utilidades de caminho */
export function getAt(obj: unknown, path: string): unknown {
  if (!path) return obj;
  return path.split(".").reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k]), obj);
}

export function setAt<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
  let cur: Record<string, unknown> = clone as Record<string, unknown>;
  let src: Record<string, unknown> = obj as Record<string, unknown>;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cur[k] = value;
      return;
    }
    const next = src?.[k];
    const copy = Array.isArray(next) ? [...next] : { ...(next as object) };
    cur[k] = copy;
    cur = copy as Record<string, unknown>;
    src = next as Record<string, unknown>;
  });
  return clone as T;
}
