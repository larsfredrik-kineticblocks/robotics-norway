import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { charter } from "../content/charter";
import { articlePlainText, articles, formatNewsDate } from "../content/news";
import { publicMembers } from "../lib/members";
import type { CorpusDocument, SearchCorpus, SearchDocument } from "../lib/types";

const root = process.cwd();

type DocumentMeta = {
  slug: string;
  name: string;
  type: string;
  mimeType: string;
  id: string;
  link: string;
  lastModified: string;
  publicAnyoneWithLink: boolean;
  extract: string | null;
  summary?: string;
  translation: string | null;
};

type DocumentsFile = {
  sharedDrive: SearchCorpus["sharedDrive"];
  documents: DocumentMeta[];
};

const translationNotice =
  "This is an English translation, not a signed original. The source-language document is the Norwegian draft.";

function read(relative: string) {
  return readFileSync(path.join(root, relative), "utf8");
}

function section(markdown: string, start: string, end?: string) {
  const startIndex = markdown.indexOf(start);
  if (startIndex < 0) throw new Error(`Could not find section heading: ${start}`);
  const rest = markdown.slice(startIndex);
  if (!end) return rest.trim();
  const endIndex = rest.indexOf(end);
  if (endIndex < 0) throw new Error(`Could not find section end: ${end}`);
  return rest.slice(0, endIndex).trim();
}

function stripMarkdown(value: string) {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractedOverride(slug: string) {
  const file = path.join(root, "content/legal/extracted", `${slug}.txt`);
  if (!existsSync(file)) return null;
  const text = readFileSync(file, "utf8").trim();
  return text.length > 0 ? text : null;
}

export function buildSearchCorpus(): SearchCorpus {
  const documentsFile = JSON.parse(read("data/documents.json")) as DocumentsFile;
  const charterMd = read("content/legal/charter.md");
  const charterEn = read("content/legal/charter.en.md");
  const sectionA = section(
    charterMd,
    "## A. Public charter (English original)",
    "## B. Intensjonsavtale",
  );
  const sectionB = section(
    charterMd,
    "## B. Intensjonsavtale om etablering av bedriftsnettverket Robotics Norway",
    "## C. Samarbeidsavtale",
  );
  const sectionC = section(
    charterMd,
    "## C. Samarbeidsavtale for bedriftsnettverket Robotics Norway",
  );
  const letter = section(
    charterEn,
    "## Letter of intent on establishing the Robotics Norway business network",
    "## Cooperation agreement",
  );
  const cooperation = section(
    charterEn,
    "## Cooperation agreement for the Robotics Norway business network",
  );
  const invitation = read("content/legal/invitation.md").trim();

  const extracts: Record<string, string> = {
    "section-a": sectionA,
    "section-b": sectionB,
    "section-c": sectionC,
    invitation,
  };
  const translations: Record<string, { title: string; text: string }> = {
    "letter-of-intent": {
      title: "Letter of intent on establishing the Robotics Norway business network",
      text: letter,
    },
    "cooperation-agreement": {
      title: "Cooperation agreement for the Robotics Norway business network",
      text: cooperation,
    },
  };

  const documents: CorpusDocument[] = documentsFile.documents.map((document) => {
    const summary = document.summary?.trim() || null;
    let text: string;
    if (summary) {
      text = summary;
    } else {
      if (!document.extract) throw new Error(`Missing extract for ${document.slug}`);
      const bundled = extracts[document.extract];
      if (!bundled) throw new Error(`Unknown extract '${document.extract}' for ${document.slug}`);
      text = extractedOverride(document.slug) ?? bundled;
    }
    const translation = document.translation ? translations[document.translation] : null;
    if (document.translation && !translation) {
      throw new Error(`Unknown translation '${document.translation}'`);
    }
    return {
      slug: document.slug,
      name: document.name,
      type: document.type,
      mimeType: document.mimeType,
      id: document.id,
      link: document.link,
      lastModified: document.lastModified,
      publicAnyoneWithLink: document.publicAnyoneWithLink,
      summary,
      text,
      translation: translation
        ? { title: translation.title, notice: translationNotice, text: translation.text }
        : null,
    };
  });

  const searchDocuments: SearchDocument[] = [
    {
      id: "charter-intro",
      group: "Charter",
      title: "Public charter",
      meta: "Charter introduction",
      href: "/#charter",
      text: `${charter.intro} ${charter.attribution}`,
    },
    ...charter.points.map((point) => ({
      id: `charter-${point.slug}`,
      group: "Charter" as const,
      title: point.title,
      meta: "Public charter",
      href: `/#${point.slug}`,
      text: `${point.title}. ${point.body}`,
    })),
    ...articles.map((article) => ({
      id: `news-${article.slug}`,
      group: "News" as const,
      title: article.title,
      meta: formatNewsDate(article.date),
      href: `/news/${article.slug}`,
      text: articlePlainText(article),
    })),
    ...documents.map((document) => ({
      id: `document-${document.slug}`,
      group: "Documents" as const,
      title: document.name,
      meta: [document.type, document.translation?.title].filter(Boolean).join(" · "),
      href: `/documents/${document.slug}`,
      text: [document.text, document.translation?.text].filter(Boolean).join("\n\n"),
    })),
    ...publicMembers().map((member) => ({
      id: `member-${member.slug}`,
      group: "Members" as const,
      title: member.companyName,
      meta: [member.contactPerson, member.contactEmail].filter(Boolean).join(" · "),
      href: `/members#${member.slug}`,
      text: [member.companyName, member.description, member.contactPerson, member.contactEmail, member.website]
        .filter(Boolean)
        .join(". "),
    })),
  ];

  return {
    charter: {
      attribution: charter.attribution,
      intro: charter.intro,
      points: charter.points,
    },
    sharedDrive: documentsFile.sharedDrive,
    documents,
    searchDocuments,
  };
}

function main() {
  const corpus = buildSearchCorpus();
  const output = path.join(root, "data/search-corpus.json");
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(corpus, null, 2)}\n`);
  console.log(
    `Wrote ${output} (${corpus.searchDocuments.length} search documents, ${stripMarkdown(corpus.documents.map((document) => document.text).join(" ")).length} characters of document text).`,
  );
}

const isDirect =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirect) {
  main();
}
