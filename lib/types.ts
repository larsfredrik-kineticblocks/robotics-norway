export type MemberStatus = "approved" | "pending" | "rejected";

export type MemberRecord = {
  id: string;
  slug: string;
  companyName: string;
  website: string | null;
  logoUrl: string | null;
  description: string;
  contactPerson: string | null;
  contactEmail: string | null;
  status: MemberStatus;
  source: "founding" | "application";
  joinedAt: string | null;
};

export type SearchGroup = "Charter" | "Documents" | "Members";

export type SearchDocument = {
  id: string;
  group: SearchGroup;
  title: string;
  text: string;
  href: string;
  meta: string;
};

export type CorpusDocument = {
  slug: string;
  name: string;
  type: string;
  mimeType: string;
  id: string;
  link: string;
  lastModified: string;
  publicAnyoneWithLink: boolean;
  text: string;
  translation: {
    title: string;
    notice: string;
    text: string;
  } | null;
};

export type SearchCorpus = {
  charter: {
    attribution: string;
    intro: string;
    points: { slug: string; title: string; body: string }[];
  };
  sharedDrive: {
    id: string;
    name: string;
    url: string;
    membersOnly: boolean;
    note: string;
  };
  documents: CorpusDocument[];
  searchDocuments: SearchDocument[];
};
