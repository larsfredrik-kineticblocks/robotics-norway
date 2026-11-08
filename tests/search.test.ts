import assert from "node:assert/strict";
import test from "node:test";
import corpus from "../data/search-corpus.json";
import { charter } from "../content/charter";
import { articleBodyWordCount, getArticle } from "../content/news";
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

  const letter = searchDocuments(data.searchDocuments, "Intensjonsavtale");
  assert.ok(letter.some((hit) => hit.href === "/documents/intensjonsavtale"));

  const english = searchDocuments(data.searchDocuments, "de minimis");
  assert.ok(english.some((hit) => hit.group === "Documents"));

  const saro = searchDocuments(data.searchDocuments, "Saro Robotics");
  assert.equal(saro[0]?.title, "Saro Robotics");
  assert.equal(saro[0]?.group, "Members");
  assert.equal(groupHits(saro)[0]?.group, "Members");
});

test("search finds the founding news article", () => {
  const article = getArticle("robotics-norway-is-founded");
  assert.ok(article);
  const words = articleBodyWordCount(article);
  assert.ok(words >= 400 && words <= 600, `expected 400–600 words, got ${words}`);

  const hits = searchDocuments(data.searchDocuments, "founding meeting StartupLab");
  const news = hits.find((hit) => hit.href === "/news/robotics-norway-is-founded");
  assert.ok(news);
  assert.equal(news.group, "News");
  assert.equal(news.title, "Robotics Norway is founded");
  assert.equal(groupHits([news])[0]?.group, "News");
});
