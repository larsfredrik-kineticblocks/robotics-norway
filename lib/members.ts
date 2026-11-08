import source from "@/data/members.source.json";
import { slugify } from "@/lib/text";
import type { MemberRecord, MembershipType } from "@/lib/types";

type SourceMember = {
  company_name: string;
  membership_kind?: MembershipType;
  affiliation?: string | null;
  website: string | null;
  website_certainty?: string;
  short_description: string | null;
  description_certainty?: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_certainty?: string;
  logo_url: string | null;
  logo_certainty?: string;
  on_inception_list?: boolean;
  on_calendar_guest_list?: boolean;
  introduced_at_meeting?: boolean;
  membership_status?: string;
};

export type MemberDecision = {
  companyName: string;
  include: boolean;
  reason: string;
};

const DECLINED = new Set(["Cognite", "AutoStore", "Intek"]);

const MISSING_DESCRIPTION = "A public description has not been confirmed yet.";

export function classifyMember(member: SourceMember): MemberDecision {
  const companyName = member.company_name.trim();
  const status = member.membership_status ?? "";

  if (
    status === "calendar_guest_organisation_unknown" ||
    companyName.toLowerCase().startsWith("(unknown")
  ) {
    return {
      companyName,
      include: false,
      reason: "Organisation unknown.",
    };
  }

  if (DECLINED.has(companyName) || status.includes("declined")) {
    return {
      companyName,
      include: false,
      reason: "Declined membership.",
    };
  }

  if (
    status.startsWith("uncertain") ||
    member.description_certainty === "uncertain" ||
    member.contact_certainty === "uncertain"
  ) {
    return {
      companyName,
      include: false,
      reason: "Flagged uncertain.",
    };
  }

  if (status === "listed_on_invitation_attendance_not_verified") {
    return {
      companyName,
      include: false,
      reason:
        "Listed on the invitation, but attendance at the founding meeting was not verified.",
    };
  }

  const present =
    member.on_inception_list === true ||
    member.on_calendar_guest_list === true ||
    member.introduced_at_meeting === true ||
    status === "founding_member_listed" ||
    status === "meeting_attendee_not_on_inception_list" ||
    status === "related_cluster_guest" ||
    status === "public_partner_guest_not_a_member" ||
    status === "listed_on_invitation_contact_unknown";

  if (!present) {
    return {
      companyName,
      include: false,
      reason: "Not recorded as present at or part of the founding meeting.",
    };
  }

  return {
    companyName,
    include: true,
    reason: "Present at or part of the founding meeting.",
  };
}

function publishedWebsite(member: SourceMember) {
  if (!member.website) return null;
  if (
    member.website_certainty === "uncertain" ||
    member.website_certainty === "unknown"
  ) {
    return null;
  }
  return member.website;
}

function publishedLogo(member: SourceMember) {
  if (!member.logo_url || member.logo_certainty !== "verified") return null;
  return member.logo_url;
}

function publishedDescription(member: SourceMember) {
  if (!member.short_description || member.description_certainty === "uncertain") {
    return MISSING_DESCRIPTION;
  }
  return member.short_description;
}

function publishedContact(member: SourceMember) {
  if (
    member.contact_certainty === "uncertain" ||
    member.contact_certainty === "unknown"
  ) {
    return { contactPerson: null, contactEmail: null };
  }
  return {
    contactPerson: member.contact_person,
    contactEmail: member.contact_email,
  };
}

function membershipTypeOf(member: SourceMember): MembershipType {
  return member.membership_kind === "individual" ? "individual" : "organisation";
}

export function toPublicMember(member: SourceMember): MemberRecord {
  const contact = publishedContact(member);
  const membershipType = membershipTypeOf(member);
  const affiliation = member.affiliation?.trim() || null;
  return {
    id: slugify(member.company_name),
    slug: slugify(member.company_name),
    membershipType,
    companyName: member.company_name,
    affiliation: membershipType === "individual" ? affiliation : null,
    website: publishedWebsite(member),
    logoUrl: publishedLogo(member),
    description: publishedDescription(member),
    contactPerson: contact.contactPerson,
    contactEmail: contact.contactEmail,
    status: "approved",
    source: "founding",
    joinedAt: "2026-11-05T09:00:00.000Z",
  };
}

const sourceMembers = source.members as SourceMember[];

export function memberDecisions() {
  return sourceMembers.map(classifyMember);
}

export function excludedMembers() {
  return memberDecisions().filter((decision) => !decision.include);
}

export function publicMembers(): MemberRecord[] {
  return sourceMembers
    .filter((member) => classifyMember(member).include)
    .map(toPublicMember)
    .sort((a, b) => a.companyName.localeCompare(b.companyName, "en"));
}

export const declinedOutsideMemberRows =
  source.declined_according_to_invitation.map((entry) => entry.company_name);

export const missingDescription = MISSING_DESCRIPTION;
