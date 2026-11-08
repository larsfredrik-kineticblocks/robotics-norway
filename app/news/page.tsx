import type { Metadata } from "next";
import { FeaturedStory, NewsCard } from "@/components/news-card";
import { NewsCardGrid } from "@/components/news-more";
import { articlesByDate } from "@/content/news";

export const metadata: Metadata = {
  title: "News",
  description: "News and events from the Robotics Norway network.",
  alternates: {
    types: {
      "application/rss+xml": "/news/rss.xml",
    },
  },
};

export default function NewsPage() {
  const [featured, ...rest] = articlesByDate();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">News</p>
          <h1 className="mt-3 font-heading text-4xl text-navy sm:text-5xl">News</h1>
        </div>
        <a href="/news/rss.xml" className="font-heading text-sm tracking-wide text-navy hover:underline">
          RSS
        </a>
      </div>
      <p className="mt-5 max-w-2xl leading-7">News and events from the Robotics Norway network.</p>
      {featured ? <FeaturedStory article={featured} /> : null}
      {rest.length > 9 ? (
        <NewsCardGrid articles={rest} />
      ) : rest.length > 0 ? (
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <li key={article.slug}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
