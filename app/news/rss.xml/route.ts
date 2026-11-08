import { articlesByDate } from "@/content/news";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pubDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).toUTCString();
}

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roboticsnorway.org";
  const items = articlesByDate()
    .map((article) => {
      const link = `${siteUrl}/news/${article.slug}`;
      const categories = (article.tags ?? [])
        .map((tag) => `      <category>${xmlEscape(tag)}</category>`)
        .join("\n");
      return `    <item>
      <title>${xmlEscape(article.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid>${xmlEscape(link)}</guid>
      <pubDate>${pubDate(article.date)}</pubDate>
      <description>${xmlEscape(article.excerpt)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Robotics Norway news</title>
    <link>${xmlEscape(`${siteUrl}/news`)}</link>
    <description>${xmlEscape("News and events from the Robotics Norway network.")}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
