import Link from "next/link";
import { ArrowLeft } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="wrap case-hero" style={{ minHeight: "70vh" }}>
      <h1 className="t-h1" style={{ marginBottom: 24 }}>
        Essa página não decolou.
      </h1>
      <p style={{ marginBottom: 32 }}>O endereço pode ter mudado. Volte para o início e siga daí.</p>
      <Link href="/" className="btn btn-primary">
        <ArrowLeft /> Voltar ao início
      </Link>
    </section>
  );
}
