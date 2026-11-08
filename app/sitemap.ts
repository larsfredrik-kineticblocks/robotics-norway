import type { MetadataRoute } from "next";
import corpus from "@/data/search-corpus.json";
import { articles } from "@/content/news";
import { projects } from "@/content/projects";
import type { SearchCorpus } from "@/lib/types";

const data = corpus as SearchCorpus;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roboticsnorway.org";
  const staticRoutes = ["", "/documents", "/members", "/projects", "/news", "/contact", "/join", "/search"];
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path || "/"}` })),
    ...data.documents.map((document) => ({ url: `${base}/documents/${document.slug}` })),
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}` })),
    ...articles.map((article) => ({ url: `${base}/news/${article.slug}` })),
  ];
}
