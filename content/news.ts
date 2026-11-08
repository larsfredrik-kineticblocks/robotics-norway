export type NewsFigure = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  /** CSS object-position when the photo is cropped into a shared frame. */
  objectPosition?: string;
};

export type TextRun = {
  text: string;
  href?: string;
};

export type NewsBlock =
  | { type: "paragraph"; runs: TextRun[] }
  | { type: "gallery"; figures: NewsFigure[]; credit: string };

export type NewsArticle = {
  slug: string;
  title: string;
  /** Calendar date, YYYY-MM-DD. */
  date: string;
  excerpt: string;
  hero: NewsFigure;
  /** Credit for the photographs in the article. */
  photoCredit: string;
  blocks: NewsBlock[];
};

const hero: NewsFigure = {
  src: "/news/opening-1.jpg",
  alt: "Participants at Robotics Norway's founding meeting on 5 November 2026.",
  width: 1600,
  height: 1041,
  caption: "Participants at the founding meeting.",
};

function paragraph(text: string): NewsBlock {
  return { type: "paragraph", runs: [{ text }] };
}

export const articles: NewsArticle[] = [
  {
    slug: "robotics-norway-is-founded",
    title: "Robotics Norway is founded",
    date: "2026-11-05",
    excerpt:
      "Participants met in person and online at StartupLab in Oslo on 5 November 2026 for the founding meeting of the Robotics Norway network.",
    hero,
    photoCredit: "Photos: StartupLab",
    blocks: [
      paragraph(
        "On 5 November 2026, Robotics Norway held its founding meeting at StartupLab in Oslo. Participants joined in person and online. The public charter from the meeting describes Robotics Norway as the network and cluster for Norwegian companies that build robots, physical AI, and the data and software around them.",
      ),
      paragraph(
        "The charter states the purpose of the network. It is to give members a shared route to buyers, partners, talent and investors, at home and abroad. It is written for companies and organisations in robotics and physical AI, and it is also open to individuals who join as private members. The wording is the English text from the founding-meeting slides, whose title is CHARTER / WHAT ROBOTICS NORWAY WILL BE. That text is published on this site.",
      ),
      paragraph("The charter has six points."),
      paragraph(
        "Open membership. The network is open to companies and organisations in robotics and physical AI, and to individuals as private members.",
      ),
      paragraph(
        "Run by its members. Members elect the steering group, set the fees and take turns as administrator, one year at a time.",
      ),
      paragraph(
        "Five hundred robot labs. The charter calls for labs in Norwegian cities where members test, collect data and demonstrate, starting at StartupLab. The heading on the slide is 500 robot labs.",
      ),
      paragraph(
        "Study trips. Members are to make joint trips to Odense, San Francisco and Shenzhen to meet clusters, buyers and manufacturers together.",
      ),
      paragraph(
        "A door to the Bay Area. The charter describes a funded project, led by Innovation Norway, that introduces Norwegian robotics companies to the Bay Area.",
      ),
      paragraph(
        "Trust between members. Market information shared in the network stays confidential, and every member runs its own business freely.",
      ),
      {
        type: "gallery",
        credit: "Photos: StartupLab",
        figures: [
          {
            src: "/news/opening-2.jpg",
            alt: "Lars-Fredrik Forberg, who chaired the founding meeting, presents next steps for Robotics Norway to participants in the room and online.",
            width: 1600,
            height: 1066,
            caption:
              "Lars-Fredrik Forberg, who chaired the founding meeting, presents next steps for Robotics Norway to participants in the room and online.",
          },
          {
            src: "/news/opening-3.jpg",
            alt: "Participants exchange ideas beside the staircase during the founding meeting.",
            width: 1600,
            height: 1052,
            caption: "Exchanging ideas beside the staircase.",
          },
          {
            src: "/news/opening-4.jpg",
            alt: "Participants network outside the StartupLab Hardware space.",
            width: 1600,
            height: 1012,
            caption: "Outside StartupLab Hardware.",
          },
          {
            src: "/news/opening-5.jpg",
            alt: "Lars-Fredrik Forberg chaired the founding meeting of Robotics Norway.",
            width: 976,
            height: 1600,
            caption: "Lars-Fredrik Forberg chaired the founding meeting of Robotics Norway.",
            objectPosition: "center 18%",
          },
        ],
      },
      paragraph(
        "Taken together, the points describe a network run by its members. They elect the steering group, set the fees and take turns as administrator, one year at a time. They share a route to buyers, partners, talent and investors in Norway and abroad. Market information shared among them stays confidential, and each member runs its own business freely. The practical work named in the charter is robot labs in Norwegian cities, starting at StartupLab, joint study trips to Odense, San Francisco and Shenzhen, and a funded Bay Area project led by Innovation Norway. The same six headings are published on the front page of this site.",
      ),
      paragraph(
        "The agenda of the founding meeting covered adopting the charter, the \"A door to the Bay Area\" project, administration, the budget and a steering group. Participants were there in person at StartupLab and online.",
      ),
      {
        type: "paragraph",
        runs: [
          {
            text: "Companies, organisations and individuals who want to take part can apply through the ",
          },
          { text: "members join form", href: "/join" },
          {
            text: ". The projects anchored in the network, including \"A door to the Bay Area\", are described on the ",
          },
          { text: "Projects page", href: "/projects" },
          { text: "." },
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug) ?? null;
}

export function articlesByDate() {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function formatNewsDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function articlePlainText(article: NewsArticle) {
  const parts = [article.excerpt, article.hero.caption, article.photoCredit];
  for (const block of article.blocks) {
    if (block.type === "paragraph") {
      parts.push(block.runs.map((run) => run.text).join(""));
    } else {
      parts.push(...block.figures.map((figure) => figure.caption));
      parts.push(block.credit);
    }
  }
  return parts.join("\n\n");
}

export function articleBodyWordCount(article: NewsArticle) {
  const text = article.blocks
    .flatMap((block) => (block.type === "paragraph" ? [block.runs.map((run) => run.text).join("")] : []))
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
