import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const bounded = localFont({
  src: "./fonts/Bounded-Latin.ttf",
  weight: "200 900",
  variable: "--font-bounded",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = getContent();
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://ideatostudio.com.br"),
    title: { default: site.seoTitle, template: `%s · ${site.name}` },
    description: site.seoDescription,
    openGraph: {
      title: site.seoTitle,
      description: site.seoDescription,
      images: ["/images/road.webp"],
      locale: "pt_BR",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1c1b1a" },
    { media: "(prefers-color-scheme: dark)", color: "#141310" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${bounded.variable} ${plexMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
