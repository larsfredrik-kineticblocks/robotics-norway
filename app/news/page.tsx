import type { Metadata } from "next";
import Link from "next/link";
import { NewsPhoto } from "@/components/news-photo";
import { articlesByDate, formatNewsDate } from "@/content/news";

export const metadata: Metadata = {
  title: "News",
  description: "News from the Robotics Norway network.",
};

export default function NewsPage() {
  const articles = articlesByDate();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">News</p>
      <h1 className="mt-3 font-heading text-4xl text-navy sm:text-5xl">News</h1>
      <p className="mt-5 max-w-2xl leading-7">
        Notes from the Robotics Norway network. Further articles will be added here.
      </p>
      <ul className="mt-12 grid gap-8">
        {articles.map((article) => (
          <li key={article.slug} className="border border-border">
            <article className="grid sm:grid-cols-[18rem_1fr]">
              <Link href={`/news/${article.slug}`} className="block bg-paper">
                <NewsPhoto figure={article.hero} sizes="(min-width: 640px) 18rem, 100vw" />
              </Link>
              <div className="flex flex-col p-6 sm:p-8">
                <time dateTime={article.date} className="text-sm text-muted-foreground">
                  {formatNewsDate(article.date)}
                </time>
                <h2 className="mt-2 font-heading text-3xl text-navy">
                  <Link href={`/news/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-3xl leading-7">{article.excerpt}</p>
                <Link
                  href={`/news/${article.slug}`}
                  className="mt-6 inline-block font-heading text-sm tracking-wide text-navy hover:underline"
                >
                  Read the article
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
