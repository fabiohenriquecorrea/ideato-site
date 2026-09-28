export type SiteMode = "online" | "maintenance" | "construction";

export type StatusScreen = {
  title1: string;
  title2: string;
  text: string;
  image: string;
  /** 0–100 */
  opacity: number;
  /** texto livre, ex.: "Volta às 18h" ou "Lançamento em outubro" */
  note: string;
  showContact: boolean;
};

export type SiteStatus = {
  mode: SiteMode;
  maintenance: StatusScreen;
  construction: StatusScreen;
};

export const STATUS_DEFAULTS: SiteStatus = {
  mode: "online",
  maintenance: {
    title1: "Voltamos",
    title2: "já, já.",
    text: "Estamos fazendo alguns ajustes no site. Enquanto isso, fale com a gente pelo Instagram.",
    image: "/images/road.webp",
    opacity: 30,
    note: "Em manutenção",
    showContact: true,
  },
  construction: {
    title1: "Da ideia",
    title2: "ao ato.",
    text: "O novo site do Ideato Studio está saindo do papel. Enquanto isso, acompanhe o trabalho pelo Instagram.",
    image: "/images/field.webp",
    opacity: 30,
    note: "Site em construção",
    showContact: true,
  },
};

export const MODE_LABEL: Record<SiteMode, string> = {
  online: "No ar",
  maintenance: "Em manutenção",
  construction: "Em construção",
};
