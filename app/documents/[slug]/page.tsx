import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import corpus from "@/data/search-corpus.json";
import { formatOsloDate } from "@/lib/export-members";
import type { SearchCorpus } from "@/lib/types";

const data = corpus as SearchCorpus;

export function generateStaticParams() {
  return data.documents.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const document = data.documents.find((item) => item.slug === slug);
  return { title: document?.name ?? "Document" };
}

export default async function DocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = data.documents.find((item) => item.slug === slug);
  if (!document) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">
        <Link href="/documents" className="hover:underline">
          Documents
        </Link>
      </p>
      <h1 className="mt-3 font-heading text-4xl text-navy">{document.name}</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {document.type} · Updated {formatOsloDate(document.lastModified)}
        {document.publicAnyoneWithLink ? " · Anyone with the link can view the file" : ""}
      </p>
      <p className="mt-4">
        <a className="font-heading text-sm tracking-wide text-flag hover:underline" href={document.link} target="_blank" rel="noreferrer">
          Open in Google
        </a>
      </p>
      <div className="mt-10">
        <Markdown source={document.text} />
      </div>
      {document.translation ? (
        <section className="mt-16 border-t border-border pt-10">
          <p className="border border-border bg-paper px-4 py-3 text-sm leading-6">{document.translation.notice}</p>
          <div className="mt-8">
            <Markdown source={document.translation.text} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
