export type CharterPoint = {
  slug: string;
  title: string;
  body: string;
};

/**
 * Public charter, section A of the founding documents.
 * Wording is the English original from the 5 November 2026 slides.
 */
export const charter = {
  attribution:
    "From the founding meeting slides, 5 November 2026, Startuplab, Oslo. Slide title: CHARTER / WHAT ROBOTICS NORWAY WILL BE.",
  intro:
    "Robotics Norway is the network/cluster for Norwegian companies that build robots, physical AI and the data and software around them, and gives its members a shared route to buyers, partners, talent and investors at home and abroad.",
  points: [
    {
      slug: "open-membership",
      title: "Open membership",
      body: "Open to robotics companies and organisations in Norway, and to individuals who live in Norway or work for a Norwegian robotics company or in academia.",
    },
    {
      slug: "run-by-its-members",
      title: "Run by its members",
      body: "Members elect the steering group and take turns as administrator, one year at a time.",
    },
    {
      slug: "robot-labs",
      title: "500 robot labs",
      body: "Five (hundred) labs in Norwegian cities where members test, collect data and demonstrate, starting at Startuplab.",
    },
    {
      slug: "study-trips",
      title: "Study trips",
      body: "Joint trips to Odense, San Francisco and Shenzhen to meet clusters, buyers and manufacturers together.",
    },
    {
      slug: "bay-area",
      title: "A door to the Bay Area",
      body: "A funded project, led by Innovation Norway, that introduces Norwegian robotics companies to the Bay Area.",
    },
    {
      slug: "trust",
      title: "Trust between members",
      body: "Market information shared in the network stays confidential, and every member runs its own business freely.",
    },
  ] satisfies CharterPoint[],
};

export const networkSummary =
  "A Norwegian network and cluster for companies that build robots, physical AI, and the data and software around them.";
