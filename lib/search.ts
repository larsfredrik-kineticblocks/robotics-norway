import MiniSearch from "minisearch";
import type { SearchDocument, SearchGroup } from "@/lib/types";

const GROUP_ORDER: SearchGroup[] = ["Charter", "News", "Documents", "Members"];

export function createSearchIndex(documents: SearchDocument[]) {
  const index = new MiniSearch<SearchDocument>({
    idField: "id",
    fields: ["title", "text", "meta"],
    storeFields: ["title", "text", "group", "href", "meta"],
    searchOptions: {
      boost: { title: 3, meta: 1.4 },
      fuzzy: 0.2,
      prefix: true,
      combineWith: "OR",
    },
  });
  index.addAll(documents);
  return index;
}

export type SearchHit = SearchDocument & { score: number; snippet: string };

export function searchDocuments(documents: SearchDocument[], query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [] as SearchHit[];
  const index = createSearchIndex(documents);
  return index.search(trimmed).map((result) => {
    const document = documents.find((item) => item.id === result.id);
    const stored = document ?? {
      id: result.id,
      group: result.group as SearchGroup,
      title: String(result.title ?? ""),
      text: String(result.text ?? ""),
      href: String(result.href ?? ""),
      meta: String(result.meta ?? ""),
    };
    return {
      ...stored,
      score: result.score,
      snippet: snippet(stored.text, trimmed),
    };
  });
}

export function groupHits(hits: SearchHit[]) {
  return GROUP_ORDER.map((group) => ({
    group,
    hits: hits.filter((hit) => hit.group === group),
  }))
    .filter((group) => group.hits.length > 0)
    .sort((a, b) => (b.hits[0]?.score ?? 0) - (a.hits[0]?.score ?? 0));
}

export function snippet(text: string, query: string, radius = 110) {
  const clean = text.replace(/\s+/g, " ").trim();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^\p{L}\p{N}]+/gu, ""))
    .filter((term) => term.length > 1);
  const lower = clean.toLowerCase();
  let index = -1;
  for (const term of terms) {
    index = lower.indexOf(term);
    if (index >= 0) break;
  }
  if (index < 0) {
    return clean.length > radius * 2 ? `${clean.slice(0, radius * 2)}…` : clean;
  }
  const start = Math.max(0, index - radius);
  const end = Math.min(clean.length, index + radius);
  return `${start > 0 ? "…" : ""}${clean.slice(start, end)}${end < clean.length ? "…" : ""}`;
}

export function webSearchHref(query: string) {
  const q = `${query.trim()} robotics Norway`.replace(/\s+/g, " ");
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

export function highlightTerms(text: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .map((term) => term.replace(/[^\p{L}\p{N}]+/gu, ""))
    .filter((term) => term.length > 1)
    .sort((a, b) => b.length - a.length);
  if (terms.length === 0) return [{ text, match: false }];
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "ig");
  return text.split(pattern).filter(Boolean).map((part) => ({
    text: part,
    match: terms.some((term) => part.toLowerCase() === term.toLowerCase()),
  }));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
