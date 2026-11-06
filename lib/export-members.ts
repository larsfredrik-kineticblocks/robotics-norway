import * as XLSX from "xlsx";
import type { MemberRecord } from "@/lib/types";

export const EXPORT_COLUMNS = [
  "company",
  "website",
  "contact person",
  "email",
  "description",
  "status",
  "joined date",
] as const;

export function formatJoinedDate(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function formatOsloDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Oslo",
  }).format(new Date(iso));
}

export function toExportRow(member: MemberRecord) {
  return {
    company: member.companyName,
    website: member.website ?? "",
    "contact person": member.contactPerson ?? "",
    email: member.contactEmail ?? "",
    description: member.description,
    status: member.status,
    "joined date": formatJoinedDate(member.joinedAt),
  };
}

function escapeCsv(value: string) {
  if (/[",\n\r]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function membersToCsv(members: MemberRecord[]) {
  const lines = [
    EXPORT_COLUMNS.join(","),
    ...members.map((member) => {
      const row = toExportRow(member);
      return EXPORT_COLUMNS.map((column) => escapeCsv(row[column])).join(",");
    }),
  ];
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export function membersToXlsx(members: MemberRecord[]) {
  const rows = members.map(toExportRow);
  const sheet = XLSX.utils.json_to_sheet(rows, { header: [...EXPORT_COLUMNS] });
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Members");
  return XLSX.write(book, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
