import Link from "next/link";
import { NewsPhoto } from "@/components/news-photo";
import { SearchBox } from "@/components/search-box";
import { networkSummary, charter } from "@/content/charter";
import { articlesByDate, formatNewsDate } from "@/content/news";
import corpus from "@/data/search-corpus.json";
import { formatOsloDate } from "@/lib/export-members";
import type { SearchCorpus } from "@/lib/types";

const data = corpus as SearchCorpus;
const latestNews = articlesByDate()[0];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-20 pb-8 sm:pt-28">
        <p className="flex items-center gap-3 font-heading text-sm tracking-wide text-navy">
          <span className="inline-block h-3 w-5 bg-flag" aria-hidden />
          <span className="inline-block h-3 w-3 bg-navy" aria-hidden />
          Founded 5 November 2026 · Startuplab, Oslo
        </p>
        <h1 className="mt-6 max-w-3xl font-heading text-5xl leading-none text-navy sm:text-6xl">
          Robotics Norway
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink">{networkSummary}</p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          The network gives its members a shared route to buyers, partners, talent and investors, in Norway and abroad.
        </p>
      </section>

      <section className="border-y border-border bg-paper" aria-labelledby="search-heading">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 id="search-heading" className="sr-only">
            Search
          </h2>
          <SearchBox welcome />
        </div>
      </section>

      {latestNews ? (
        <section className="mx-auto max-w-6xl px-5 py-16" aria-labelledby="latest-news-heading">
          <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">News</p>
          <h2 id="latest-news-heading" className="mt-3 font-heading text-4xl text-navy">
            Latest news
          </h2>
          <article className="mt-8 grid border border-border sm:grid-cols-[18rem_1fr]">
            <Link href={`/news/${latestNews.slug}`} className="block bg-paper">
              <NewsPhoto figure={latestNews.hero} sizes="(min-width: 640px) 18rem, 100vw" />
            </Link>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <time dateTime={latestNews.date} className="text-sm text-muted-foreground">
                {formatNewsDate(latestNews.date)}
              </time>
              <h3 className="mt-2 font-heading text-2xl text-navy">
                <Link href={`/news/${latestNews.slug}`} className="hover:underline">
                  {latestNews.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-xl leading-7">{latestNews.excerpt}</p>
              <Link
                href={`/news/${latestNews.slug}`}
                className="mt-4 inline-block font-heading text-sm tracking-wide text-navy hover:underline"
              >
                Read the article
              </Link>
            </div>
          </article>
        </section>
      ) : null}

      <section id="charter" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
        <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Charter</p>
        <h2 className="mt-3 font-heading text-4xl text-navy">What Robotics Norway will be</h2>
        <p className="mt-8 max-w-3xl text-lg leading-8">{charter.intro}</p>
        <ol className="mt-12 max-w-3xl divide-y divide-border border-y border-border">
          {charter.points.map((point, index) => (
            <li id={point.slug} key={point.slug} className="grid gap-3 py-7 sm:grid-cols-[4rem_1fr] scroll-mt-28">
              <span className="font-heading text-lg text-flag">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-heading text-2xl text-navy">{point.title}</h3>
                <p className="mt-2 leading-7">{point.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm leading-6 text-muted-foreground">{charter.attribution}</p>
      </section>

      <section id="documents" className="mx-auto max-w-6xl scroll-mt-28 px-5 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Documents</p>
            <h2 className="mt-3 font-heading text-4xl text-navy">Shared documents</h2>
          </div>
          <Link href="/documents" className="font-heading text-sm tracking-wide text-navy hover:underline">
            Full index
          </Link>
        </div>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {data.documents.map((document) => (
            <li key={document.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <a href={document.link} className="font-heading text-lg text-navy hover:underline" target="_blank" rel="noreferrer">
                  {document.name}
                </a>
                <p className="text-sm text-muted-foreground">
                  {document.type} · Updated {formatOsloDate(document.lastModified)}
                </p>
              </div>
              <Link href={`/documents/${document.slug}`} className="text-sm text-flag hover:underline">
                Read text
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Robotics Norway",
            url: "https://roboticsnorway.org",
            foundingDate: "2026-11-05",
            email: "lars.fredrik@kineticblocks.com",
            description: networkSummary,
          }),
        }}
      />
    </>
  );
}
