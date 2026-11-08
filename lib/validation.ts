import type { MembershipType } from "@/lib/types";

export type ApplicationInput = {
  membershipType: MembershipType;
  companyName: string;
  affiliation: string | null;
  website: string | null;
  logoUrl: string | null;
  description: string;
  contactPerson: string;
  contactEmail: string;
};

export type FieldErrors = Record<string, string>;

const LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const MAX_LOGO_BYTES = 150_000;

export function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function validHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateLogoDataUrl(value: string): string | null {
  const match = /^data:(image\/(?:png|jpeg|webp|gif|svg\+xml));base64,([a-z0-9+/=\s]+)$/i.exec(
    value.trim(),
  );
  if (!match || !LOGO_TYPES.includes(match[1].toLowerCase())) {
    return "Upload a PNG, JPEG, WebP, GIF or SVG logo.";
  }
  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64").length;
  if (!bytes || bytes > MAX_LOGO_BYTES) {
    return "Logo files must be 150 KB or smaller.";
  }
  return null;
}

export function parseApplication(input: {
  membershipType?: string;
  companyName?: string;
  fullName?: string;
  affiliation?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  contactPerson?: string;
  contactEmail?: string;
  consent?: boolean;
  logoDataUrl?: string | null;
}): { ok: true; data: ApplicationInput } | { ok: false; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {};
  const membershipType: MembershipType = input.membershipType === "individual" ? "individual" : "organisation";
  const companyName = input.companyName?.trim() ?? "";
  const fullName = input.fullName?.trim() ?? "";
  const affiliation = input.affiliation?.trim() ?? "";
  const websiteRaw = normalizeWebsite(input.website ?? "");
  const logoUrlRaw = input.logoUrl?.trim() ?? "";
  const description = input.description?.trim() ?? "";
  const contactPerson = input.contactPerson?.trim() ?? "";
  const contactEmail = input.contactEmail?.trim().toLowerCase() ?? "";

  if (membershipType === "individual") {
    if (fullName.length < 2) fieldErrors.fullName = "Enter your full name.";
    else if (fullName.length > 160) fieldErrors.fullName = "Name is too long.";
    if (affiliation.length > 160) fieldErrors.affiliation = "Affiliation is too long.";
  } else {
    if (companyName.length < 2) {
      fieldErrors.companyName = "Enter the company name.";
    } else if (companyName.length > 160) {
      fieldErrors.companyName = "Company name is too long.";
    }
    if (!websiteRaw || !validHttpUrl(websiteRaw)) {
      fieldErrors.website = "Enter a valid company website.";
    }
    if (contactPerson.length < 2) {
      fieldErrors.contactPerson = "Enter a contact person.";
    }
  }

  if (description.length < 20) {
    fieldErrors.description =
      membershipType === "individual"
        ? "Write a short note of at least 20 characters."
        : "Write a short description of at least 20 characters.";
  } else if (description.length > 600) {
    fieldErrors.description = "Keep the description under 600 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    fieldErrors.contactEmail = membershipType === "individual" ? "Enter a valid email." : "Enter a valid company email.";
  }

  if (input.consent !== true) {
    fieldErrors.consent = "Consent is required before the application can be stored.";
  }

  let website: string | null = null;
  if (membershipType === "individual") {
    if (websiteRaw) {
      if (!validHttpUrl(websiteRaw)) fieldErrors.website = "Enter a valid LinkedIn or website address.";
      else website = websiteRaw;
    }
  } else if (websiteRaw && validHttpUrl(websiteRaw)) {
    website = websiteRaw;
  }

  let logoUrl: string | null = null;
  if (membershipType === "organisation") {
    if (input.logoDataUrl) {
      const logoError = validateLogoDataUrl(input.logoDataUrl);
      if (logoError) fieldErrors.logo = logoError;
      else logoUrl = input.logoDataUrl.trim();
    } else if (logoUrlRaw) {
      if (!validHttpUrl(logoUrlRaw)) {
        fieldErrors.logo = "Logo URL must start with http:// or https://.";
      } else {
        logoUrl = logoUrlRaw;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      membershipType,
      companyName: membershipType === "individual" ? fullName : companyName,
      affiliation: membershipType === "individual" && affiliation ? affiliation : null,
      website,
      logoUrl,
      description,
      contactPerson: membershipType === "individual" ? fullName : contactPerson,
      contactEmail,
    },
  };
}

export function parseMemberEdit(input: {
  membershipType?: string;
  companyName?: string;
  affiliation?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  contactPerson?: string;
  contactEmail?: string;
  status?: string;
  logoDataUrl?: string | null;
}): { ok: true; data: ApplicationInput & { status: "approved" | "pending" | "rejected" } } | { ok: false; fieldErrors: FieldErrors } {
  const membershipType = input.membershipType === "individual" ? "individual" : "organisation";
  const parsed = parseApplication({
    ...input,
    membershipType,
    fullName: membershipType === "individual" ? input.companyName : "",
    consent: true,
  });
  const fieldErrors = parsed.ok ? {} : { ...parsed.fieldErrors };
  delete fieldErrors.consent;
  const status = input.status;
  if (status !== "approved" && status !== "pending" && status !== "rejected") {
    fieldErrors.status = "Choose a status.";
    return { ok: false, fieldErrors };
  }
  if (!parsed.ok) return { ok: false, fieldErrors };
  return {
    ok: true,
    data: { ...parsed.data, status },
  };
}

export async function logoFromFormFile(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return { dataUrl: null as string | null };
  if (!LOGO_TYPES.includes(file.type)) {
    return { error: "Upload a PNG, JPEG, WebP, GIF or SVG logo." };
  }
  if (file.size > MAX_LOGO_BYTES) {
    return { error: "Logo files must be 150 KB or smaller." };
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  return {
    dataUrl: `data:${file.type};base64,${bytes.toString("base64")}`,
  };
}
