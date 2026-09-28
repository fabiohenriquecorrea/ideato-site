import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseView } from "@/components/views/CaseView";
import { getContent } from "@/lib/content";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return getContent().works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const work = getContent().works.find((w) => w.slug === slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.summary,
    openGraph: work.image ? { images: [work.image] } : undefined,
  };
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const content = getContent();
  if (!content.works.some((w) => w.slug === slug)) notFound();
  return <CaseView content={content} slug={slug} />;
}
