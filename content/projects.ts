export type Project = {
  slug: string;
  title: string;
  status: string;
  summary: string;
  paragraphs: string[];
  elements: string[];
  timeline: { when: string; what: string }[];
  interested: string;
  note: string;
};

export const projects: Project[] = [
  {
    slug: "door-to-the-bay-area",
    title: "A door to the Bay Area",
    status: "In preparation",
    summary:
      "A funded internationalisation project, separate from but anchored in the open Robotics Norway member network. It introduces a smaller group of Norwegian robotics companies to buyers, partners and investors in the San Francisco Bay Area.",
    paragraphs: [
      "The founding-meeting slides described a group of 3–10 companies, and the Innovation Norway discussion a group of 5–10, with the Bay Area as a primary market. The project is a shared door opener, rather than each company building the same US contacts alone.",
      "Innovation Norway’s San Francisco office is proposed as paid project manager and on-the-ground door opener under Innovation Norway’s bedriftsnettverk scheme. The grant discussed is up to about NOK 1 million per year for up to three years. A member company must be the legal applicant: Robotics Norway as such cannot apply. Kinetic Blocks AS is the proposed applicant and administrator for 2027, with a recommendation to consider a lead company registered outside Oslo because the Oslo office is often oversubscribed.",
      "A letter of intent is required to apply and was to be circulated to interested parties. The December or January event is described as a preparatory activity before a formal project start on 1 January 2027. The application deadline cited in the materials is 1 December 2026.",
    ],
    elements: [
      "A shared door opener for buyers, partners and investors in the San Francisco Bay Area.",
      "A preparatory event before Christmas 2026, late in the year, at Nordic Innovation House in Palo Alto or at Stanford. Stanford was recommended in the 29 October 2026 Innovation Norway San Francisco check-in. The invitation still names Nordic Innovation House for premises.",
      "A study trip to San Francisco in April 2027, plus buyer meetings through the year.",
    ],
    timeline: [
      {
        when: "Before Christmas 2026",
        what: "Preparatory event in Palo Alto or at Stanford.",
      },
      {
        when: "1 December 2026",
        what: "Application deadline cited in the founding materials.",
      },
      {
        when: "1 January 2027",
        what: "Formal project start, if a grant is awarded.",
      },
      {
        when: "April 2027",
        what: "Study trip to San Francisco, with buyer meetings through the year.",
      },
    ],
    interested:
      "Confirmed interest at the founding meeting, according to the meeting notes: Kinetic Blocks, Lito (Thomas), Hive Autonomy, and others (4–5 companies).",
    note: "Compiled 6 November 2026 from the founding-meeting slides and meeting notes. This is not a formal signed project document.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug) ?? null;
}
