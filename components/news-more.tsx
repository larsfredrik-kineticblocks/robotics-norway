"use client";

import { useState } from "react";
import { NewsCard } from "@/components/news-card";
import type { NewsArticle } from "@/content/news";

const PAGE_SIZE = 9;

export function NewsCardGrid({ articles }: { articles: NewsArticle[] }) {
  const [count, setCount] = useState(Math.min(PAGE_SIZE, articles.length));
  const visible = articles.slice(0, count);

  return (
    <div className="mt-12">
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <li key={article.slug}>
            <NewsCard article={article} />
          </li>
        ))}
      </ul>
      {count < articles.length ? (
        <button
          type="button"
          className="mt-8 border border-navy px-5 py-2 font-heading text-sm tracking-wide text-navy hover:bg-navy hover:text-white"
          onClick={() => setCount((shown) => Math.min(articles.length, shown + PAGE_SIZE))}
        >
          Load more
        </button>
      ) : null}
    </div>
  );
}
