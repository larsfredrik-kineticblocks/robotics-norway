"use client";

import { useSearchParams } from "next/navigation";
import { Mascot } from "@/components/mascot";
import corpus from "@/data/search-corpus.json";
import { groupHits, highlightTerms, searchDocuments, webSearchHref } from "@/lib/search";
import type { SearchCorpus } from "@/lib/types";

const data = corpus as SearchCorpus;

export function SearchScreen() {
  const params = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const hits = query ? searchDocuments(data.searchDocuments, query) : [];
  const groups = groupHits(hits);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex items-end gap-4">
        <Mascot className="h-24 w-auto sm:h-28" />
        <div>
          <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Search</p>
          <h1 className="mt-2 font-heading text-4xl text-navy">Search results</h1>
        </div>
      </div>
      <form action="/search" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row" role="search">
        <label className="sr-only" htmlFor="search-q">
          Search the network
        </label>
        <input
          id="search-q"
          name="q"
          key={query}
          defaultValue={query}
          placeholder="Charter, documents, members"
          className="h-12 w-full rounded-lg border border-input px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <button
          type="submit"
          className="h-12 rounded-lg bg-navy px-6 font-heading text-sm tracking-wide text-white hover:bg-navy/90"
        >
          Search
        </button>
      </form>

      {!query ? (
        <p className="mt-10 max-w-xl text-muted-foreground">
          Search the public charter, document titles and text, and member companies.
        </p>
      ) : (
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">
            {hits.length === 0
              ? `No matches in Robotics Norway for “${query}”.`
              : `${hits.length} ${hits.length === 1 ? "match" : "matches"} for “${query}”.`}
          </p>
          <div className="mt-8 space-y-10">
            {groups.map((group) => (
              <section key={group.group} aria-labelledby={`group-${group.group}`}>
                <h2 id={`group-${group.group}`} className="font-heading text-2xl text-navy">
                  {group.group}
                </h2>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {group.hits.map((hit) => (
                    <li key={hit.id} className="py-5">
                      <a href={hit.href} className="font-heading text-lg text-navy hover:underline">
                        {hit.title}
                      </a>
                      {hit.meta ? <p className="mt-1 text-sm text-muted-foreground">{hit.meta}</p> : null}
                      <p className="mt-2 text-sm leading-6 text-ink">
                        {highlightTerms(hit.snippet, query).map((part, index) =>
                          part.match ? (
                            <mark key={index} className="bg-flag/15 text-inherit">
                              {part.text}
                            </mark>
                          ) : (
                            <span key={index}>{part.text}</span>
                          ),
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <aside className="mt-12 max-w-xl border border-border bg-paper p-5">
            <h2 className="font-heading text-lg text-navy">Search the web</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This leaves Robotics Norway and opens a general web search for “{query}”, with the words
              robotics and Norway added so the results stay in a robotics context. It does not search our
              documents.
            </p>
            <a
              className="mt-4 inline-flex font-heading text-sm tracking-wide text-flag hover:underline"
              href={webSearchHref(query)}
              target="_blank"
              rel="noreferrer"
            >
              Search the web
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
