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
  | { type: "heading"; text: string }
  | { type: "figure"; figure: NewsFigure; credit?: string }
  | { type: "gallery"; figures: NewsFigure[]; credit: string; frame?: boolean };

export type NewsArticle = {
  slug: string;
  title: string;
  /** Calendar date, YYYY-MM-DD. */
  date: string;
  /**
   * Tie-break when two articles share a date. Higher numbers are listed first.
   */
  order: number;
  /** Short labels such as Network or Events. */
  tags?: string[];
  /** Place shown after the date. Defaults to StartupLab, Oslo. */
  place?: string;
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

function heading(text: string): NewsBlock {
  return { type: "heading", text };
}

function photo(file: string, width: number, height: number, text: string): NewsFigure {
  return { src: file, alt: text, caption: text, width, height };
}

const startuplabCredit = "Photos: Startuplab";

export const articles: NewsArticle[] = [
  {
    slug: "humanoids-at-work",
    title: "Humanoids at work: Startuplab and IMD Alumni Club of Norway bring physical AI to Norwegian business",
    date: "2026-11-05",
    order: 2,
    tags: ["Events"],
    place: "Startuplab, Oslo",
    excerpt:
      "Startuplab and IMD Alumni Club of Norway gathered business leaders, startups and robots to explore what humanoids can do at work.",
    hero: photo(
      "/news/humanoids-1.jpg",
      1600,
      966,
      "Marie Mostad, CEO of Startuplab, opens Humanoids at work in front of a full house.",
    ),
    photoCredit: startuplabCredit,
    blocks: [
      paragraph(
        "The 1990s gave us the PC, the 2000s the internet, then came the smartphone, and now AI. Will humanoids shape the 2030s and beyond?",
      ),
      paragraph(
        "On 5 November, Startuplab and the IMD Alumni Club of Norway hosted \"Humanoids at work\" for Startuplab's Corporate Innovation Network. The aim was to lower the threshold, take the edge off what can feel intimidating, and get people thinking about testing and using robots in their own businesses. The event brought together large companies, startups and scale-ups. Marie Mostad, CEO of Startuplab, opened the afternoon.",
      ),
      heading("The money is moving in"),
      paragraph(
        "Capital is pouring into the field. More funding has already been raised for humanoid robotics in 2026 than in 2024 and 2025 combined. According to Christian Rokseth, founder of Humanoid.guide, a new humanoid is launched roughly every day. Even so, most of the activity is still about research and showing up at events. But that is how every new technology starts.",
      ),
      {
        type: "gallery",
        frame: false,
        credit: startuplabCredit,
        figures: [
          photo(
            "/news/humanoids-2.jpg",
            1600,
            1096,
            "Lars-Fredrik Forberg, IMD Alumni Club and Kinetic Blocks, presents the charter for Robotics Norway.",
          ),
          photo(
            "/news/humanoids-3.jpg",
            1600,
            1040,
            "Christian Rokseth, Humanoid.guide, on the humanoid makers to know in China, the USA and Europe.",
          ),
        ],
      },
      heading("From observing to doing"),
      paragraph(
        "Robotics is not new, and the industry is well under way. As Sigrid Kjønnø Schaanning of Cognite showed, robots are moving from observing, for example on inspection rounds on oil platforms, to carrying out tasks that until now have been reserved for people. Fine motor skills, the fingertip feel humans train from infancy, are being practised hard, and progress is fast.",
      ),
      {
        type: "figure",
        credit: startuplabCredit,
        figure: photo(
          "/news/humanoids-4.jpg",
          1600,
          1028,
          "Sigrid Kjønnø Schaanning, Cognite, on robotics and autonomous industry.",
        ),
      },
      heading("Will we be replaced?"),
      paragraph(
        "In the panel, moderated by Christina Wiig of Startuplab, Marcus Horn (Dotspot) and Lone Werness Bekkeheien (Marselia Robotics) pointed out that many people in the field look forward to getting rid of boring tasks, and believe it will free up time for more important work. As with generative AI, the key is to let employees decide and become the experts on what should be automated, and how. Mandate, budget and ownership belong in the line organisation. In other words: good change management.",
      ),
      paragraph(
        "This matters to all of us. Half of the world economy is physical work, and sectors such as health, hospitality and mobility need more hands. Imagine a humanoid that cleans and tidies, so home care workers have time to sit down with the elderly. \"People will now get more time for people,\" said Julian Alexander Hahn of Wybe.",
      ),
      {
        type: "figure",
        credit: startuplabCredit,
        figure: photo(
          "/news/humanoids-5.jpg",
          1600,
          1096,
          "From left: Sigrid Kjønnø Schaanning (Cognite), Marcus Horn (Dotspot), Lone Werness Bekkeheien (Marselia Robotics), Christian Rokseth (Humanoid.guide) and moderator Christina Wiig (Startuplab).",
        ),
      },
      heading("A late visitor from Moss"),
      paragraph(
        "Julian Alexander Hahn, founder of Wybe Robotics in Moss, arrived at the very end with a humanoid in tow. Wybe builds what it calls robotic employees. It starts as software on a small on-premises device, the Wybe Node, which handles calls, emails, scheduling and follow-ups around the clock in more than 30 languages. When a role needs hands, the same \"brain\" can be given a humanoid body for cleaning, reception or security. Wybe buys the robot bodies from hardware partners and installs its own software, safety systems and intelligence at its R&D lab in Moss. Consumers can now reserve a Wybe for the home, guided at first through VR teleoperation, with deliveries to Norwegian homes planned before the new year.",
      ),
      {
        type: "gallery",
        frame: false,
        credit: startuplabCredit,
        figures: [
          photo(
            "/news/humanoids-8.jpg",
            1600,
            1066,
            "Julian Alexander Hahn of Wybe Robotics (right) presents the Wybe, steered by a colleague wearing a VR headset.",
          ),
          photo(
            "/news/humanoids-7.jpg",
            1600,
            1146,
            "A member of the Wybe team tries VR teleoperation of the humanoid.",
          ),
        ],
      },
      heading("Missed this time: Per Ivar Selvaag"),
      paragraph(
        "Per Ivar Selvaag, former VP of Design at 1X Technologies, where he led the design of the NEO home humanoid, and a lead designer at BMW before that, was due to speak but was ill on the day. His planned talk argued that the uncanny valley is a business problem, not an aesthetic one: whether people accept a humanoid in their home or workplace comes down to design. We hope to hear him at a later event.",
      ),
      heading("What should you do?"),
      paragraph(
        "Those who start early gain a big advantage when the technology matures. Do you have tasks that are physical, repetitive, boring or unsafe? Map them. Collect data. Test. Robot Garden at Fornebu is a physical test arena for industry, and digital simulations take you a long way. Lars-Fredrik Forberg, who also presented the Robotics Norway network and its charter at the event, is building Kinetic Blocks, a marketplace for robot training data.",
      ),
      paragraph(
        "And at home? Many are waiting for their Neo from 1X, and you can now also rent one through Wybe in time for Christmas. Perhaps 2026 is the last year you sort your own laundry.",
      ),
      paragraph(
        "Bettina Lycke of Startuplab closed the afternoon, and the conversation continued over mingling with humans and humanoids alike.",
      ),
      {
        type: "figure",
        credit: startuplabCredit,
        figure: photo("/news/humanoids-6.jpg", 1600, 926, "Guests meet the humanoid after the talks."),
      },
      paragraph(
        "Thanks to everyone who took part, and especially to Christian Rokseth (Humanoid.guide), Sigrid Kjønnø Schaanning (Cognite), Lars-Fredrik Forberg (Kinetic Blocks), Marcus Horn (Dotspot), Lone Werness Bekkeheien (Marselia Robotics), Julian Alexander Hahn (Wybe Robotics), and the driving force Christina Wiig (Startuplab).",
      ),
    ],
  },
  {
    slug: "robotics-norway-is-founded",
    title: "Robotics Norway is founded",
    date: "2026-11-05",
    order: 1,
    tags: ["Network"],
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
        "Run by its members. Members elect the steering group and take turns as administrator, one year at a time.",
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
        "Taken together, the points describe a network run by its members. They elect the steering group and take turns as administrator, one year at a time. They share a route to buyers, partners, talent and investors in Norway and abroad. Market information shared among them stays confidential, and each member runs its own business freely. The practical work named in the charter is robot labs in Norwegian cities, starting at StartupLab, joint study trips to Odense, San Francisco and Shenzhen, and a funded Bay Area project led by Innovation Norway. The same six headings are published on the front page of this site.",
      ),
      heading("What the meeting agreed"),
      paragraph(
        "Around 30 companies and organisations took part, in the room and online, from startups to Ruter, Posten Bring, Cognite and Oslo kommune. The participants backed the initiative and agreed on three things.",
      ),
      paragraph(
        "A small steering group was formed, with Daniel (Saro Robotics), Eva (Necia), Christian Rokseth (Humanoid.guide) and Runway FBU confirmed, and others invited to join. Four to five companies signed up their interest in \"A door to the Bay Area\", and a letter of intent is now going out so the network can apply to Innovation Norway. Around 16 people raised their hands for a study trip to Shenzhen, which will be coordinated with the Norwegian Robotics Cluster.",
      ),
      paragraph(
        "Robotics Norway is meant to complement existing networks such as the Norwegian Robotics Cluster and Necia, not compete with them, and members are free to take part in several. Before any new labs are built, the network will map the robot labs and test arenas that already exist across Norway.",
      ),
      {
        type: "paragraph",
        runs: [
          { text: "Read the " },
          {
            text: "full minutes of the founding meeting",
            href: "https://docs.google.com/document/d/1-pAQCUOvl1dilJpSmy71cnD_6kyUWEN35i8tzrYDHSk/edit",
          },
          { text: "." },
        ],
      },
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
      {
        type: "paragraph",
        runs: [
          { text: "Read Shifter's coverage of the founding meeting (in Norwegian): " },
          {
            text: "Starter nytt robotikk-nettverk",
            href: "https://www.shifter.no/nyheter/starter-nytt-robotikk-nettverk/481686",
          },
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug) ?? null;
}

export function compareArticles(a: Pick<NewsArticle, "date" | "order">, b: Pick<NewsArticle, "date" | "order">) {
  const byDate = b.date.localeCompare(a.date);
  if (byDate !== 0) return byDate;
  return (b.order ?? 0) - (a.order ?? 0);
}

export function articlesByDate() {
  return [...articles].sort(compareArticles);
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
  const parts = [article.excerpt, article.tags?.join(", "), article.hero.caption, article.photoCredit].filter(
    (part): part is string => Boolean(part),
  );
  for (const block of article.blocks) {
    if (block.type === "paragraph") {
      parts.push(block.runs.map((run) => run.text).join(""));
    } else if (block.type === "heading") {
      parts.push(block.text);
    } else if (block.type === "figure") {
      parts.push(block.figure.caption);
      if (block.credit) parts.push(block.credit);
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
