import Link from "next/link";
import { NewsPhoto } from "@/components/news-photo";
import { formatNewsDate, type NewsArticle } from "@/content/news";

export function NewsTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="border border-flag/40 px-2 py-0.5 font-heading text-xs tracking-[0.12em] text-flag uppercase"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function FeaturedStory({ article }: { article: NewsArticle }) {
  return (
    <article className="mt-12 border border-border">
      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Link href={`/news/${article.slug}`} className="block bg-paper">
          <NewsPhoto
            figure={article.hero}
            frame
            preload
            sizes="(min-width: 1024px) 40rem, 100vw"
          />
        </Link>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <time dateTime={article.date} className="text-sm text-muted-foreground">
              {formatNewsDate(article.date)}
            </time>
            <NewsTags tags={article.tags} />
          </div>
          <h2 className="mt-4 font-heading text-4xl leading-none text-navy sm:text-5xl">
            <Link href={`/news/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8">{article.excerpt}</p>
          <Link
            href={`/news/${article.slug}`}
            className="mt-6 inline-block font-heading text-sm tracking-wide text-navy hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex h-full flex-col border border-border">
      <Link href={`/news/${article.slug}`} className="block bg-paper">
        <NewsPhoto figure={article.hero} frame sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <time dateTime={article.date} className="text-sm text-muted-foreground">
            {formatNewsDate(article.date)}
          </time>
          <NewsTags tags={article.tags} />
        </div>
        <h2 className="mt-3 font-heading text-2xl leading-tight text-navy">
          <Link href={`/news/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 leading-7">{article.excerpt}</p>
        <Link
          href={`/news/${article.slug}`}
          className="mt-5 inline-block font-heading text-sm tracking-wide text-navy hover:underline"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
