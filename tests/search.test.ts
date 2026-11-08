import assert from "node:assert/strict";
import test from "node:test";
import corpus from "../data/search-corpus.json";
import { charter } from "../content/charter";
import { articlesByDate, compareArticles, getArticle } from "../content/news";
import { groupHits, searchDocuments } from "../lib/search";
import type { SearchCorpus } from "../lib/types";

const data = corpus as SearchCorpus;

test("search corpus matches the public charter", () => {
  assert.equal(data.charter.intro, charter.intro);
  assert.equal(data.charter.points.length, 6);
});

test("search finds charter, documents and members", () => {
  const confidential = searchDocuments(data.searchDocuments, "confidential");
  assert.ok(confidential.some((hit) => hit.group === "Charter" && hit.title === "Trust between members"));

  const charterDoc = searchDocuments(data.searchDocuments, "Membership is free");
  assert.ok(charterDoc.some((hit) => hit.href === "/documents/charter"));

  const english = searchDocuments(data.searchDocuments, "de minimis");
  assert.ok(english.some((hit) => hit.group === "Documents"));

  const saro = searchDocuments(data.searchDocuments, "Saro Robotics");
  assert.equal(saro[0]?.title, "Saro Robotics");
  assert.equal(saro[0]?.group, "Members");
  assert.equal(groupHits(saro)[0]?.group, "Members");
});

test("news sorts newest first and breaks date ties by order", () => {
  const sorted = [
    { date: "2026-11-05", order: 1 },
    { date: "2026-11-05", order: 3 },
    { date: "2026-11-06", order: 0 },
    { date: "2026-10-01", order: 9 },
  ].sort(compareArticles);
  assert.deepEqual(
    sorted.map((article) => `${article.date}:${article.order}`),
    ["2026-11-06:0", "2026-11-05:3", "2026-11-05:1", "2026-10-01:9"],
  );
});

test("humanoids at work is featured ahead of the founding article", () => {
  const sorted = articlesByDate();
  assert.equal(sorted[0]?.slug, "humanoids-at-work");
  assert.equal(sorted[0]?.date, "2026-11-05");
  assert.equal(sorted[1]?.slug, "robotics-norway-is-founded");
  assert.equal(sorted[1]?.date, "2026-11-05");
  assert.ok((sorted[0]?.order ?? 0) > (sorted[1]?.order ?? 0));
});

test("search finds the founding news article", () => {
  const article = getArticle("robotics-norway-is-founded");
  assert.ok(article);
  const text = article.blocks
    .flatMap((block) => {
      if (block.type === "paragraph") return [block.runs.map((run) => run.text).join("")];
      if (block.type === "heading") return [block.text];
      return [];
    })
    .join("\n");
  assert.match(text, /Five hundred robot labs\. The charter calls for labs/);
  assert.match(text, /What the meeting agreed/);
  assert.match(text, /Around 30 companies and organisations took part/);
  const agreed = text.indexOf("What the meeting agreed");
  const minutesLink = text.indexOf("full minutes of the founding meeting");
  const taken = text.indexOf("Taken together, the points describe");
  const agenda = text.indexOf("The agenda of the founding meeting covered");
  assert.ok(taken < agreed && agreed < minutesLink && minutesLink < agenda);

  const minutes = data.documents.find((document) => document.slug === "founding-meeting-minutes");
  assert.ok(minutes);
  assert.equal(
    minutes.link,
    "https://docs.google.com/document/d/1-pAQCUOvl1dilJpSmy71cnD_6kyUWEN35i8tzrYDHSk/edit",
  );
  assert.match(minutes.summary ?? "", /steering group and next steps/);
  assert.ok(minutes.text.length < 400);

  const hits = searchDocuments(data.searchDocuments, "founding meeting StartupLab");
  const news = hits.find((hit) => hit.href === "/news/robotics-norway-is-founded");
  assert.ok(news);
  assert.equal(news.group, "News");
  assert.equal(news.title, "Robotics Norway is founded");
  assert.equal(groupHits([news])[0]?.group, "News");
});
