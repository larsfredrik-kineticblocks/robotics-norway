import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsPhoto } from "@/components/news-photo";
import { articles, formatNewsDate, getArticle, type TextRun } from "@/content/news";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "News" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      images: [{ url: article.hero.src, alt: article.hero.alt, width: article.hero.width, height: article.hero.height }],
    },
  };
}

function isExternalHref(href: string) {
  return href.startsWith("https://") || href.startsWith("http://");
}

function RichText({ runs }: { runs: TextRun[] }) {
  const className = "text-navy underline decoration-border underline-offset-4 hover:decoration-navy";
  return runs.map((run, index) => {
    if (!run.href) return <span key={index}>{run.text}</span>;
    if (isExternalHref(run.href)) {
      return (
        <a key={index} href={run.href} target="_blank" rel="noopener noreferrer" className={className}>
          {run.text}
        </a>
      );
    }
    return (
      <Link key={index} href={run.href} className={className}>
        {run.text}
      </Link>
    );
  });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roboticsnorway.org";

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">
        <Link href="/news" className="hover:underline">
          News
        </Link>
      </p>
      <h1 className="mt-3 font-heading text-4xl text-navy sm:text-5xl">{article.title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        <time dateTime={article.date}>{formatNewsDate(article.date)}</time>
        {` · ${article.place ?? "StartupLab, Oslo"}`}
      </p>
      <figure className="mt-8">
        <NewsPhoto figure={article.hero} preload sizes="(min-width: 48rem) 48rem, 100vw" />
        <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
          <p>{article.hero.caption}</p>
          <p className="mt-1">{article.photoCredit}</p>
        </figcaption>
      </figure>
      <div className="mt-8 space-y-5 text-base leading-7">
        {article.blocks.map((block, index) => {
          if (block.type === "paragraph") {
            return (
              <p key={index}>
                <RichText runs={block.runs} />
              </p>
            );
          }
          if (block.type === "heading") {
            return (
              <h2 key={index} className="pt-6 font-heading text-2xl text-navy">
                {block.text}
              </h2>
            );
          }
          if (block.type === "figure") {
            return (
              <figure key={index} className="my-8">
                <NewsPhoto figure={block.figure} sizes="(min-width: 48rem) 48rem, 100vw" />
                <figcaption className="mt-2 text-sm leading-6 text-muted-foreground">
                  <p>{block.figure.caption}</p>
                  {block.credit ? <p className="mt-1">{block.credit}</p> : null}
                </figcaption>
              </figure>
            );
          }
          const paired = block.figures.length > 1;
          return (
            <figure key={index} className="my-10">
              <div className={paired ? "grid gap-6 sm:grid-cols-2" : "grid gap-6"}>
                {block.figures.map((figure) => (
                  <figure key={figure.src}>
                    <NewsPhoto
                      figure={figure}
                      frame={block.frame !== false}
                      sizes={paired ? "(min-width: 40rem) 22rem, 100vw" : "(min-width: 48rem) 48rem, 100vw"}
                    />
                    <figcaption className="mt-2 text-sm leading-6 text-muted-foreground">{figure.caption}</figcaption>
                  </figure>
                ))}
              </div>
              <figcaption className="mt-4 text-sm text-muted-foreground">{block.credit}</figcaption>
            </figure>
          );
        })}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            datePublished: article.date,
            description: article.excerpt,
            image: [`${siteUrl}${article.hero.src}`],
            mainEntityOfPage: `${siteUrl}/news/${article.slug}`,
            publisher: {
              "@type": "Organization",
              name: "Robotics Norway",
              url: siteUrl,
            },
          }),
        }}
      />
    </article>
  );
}
