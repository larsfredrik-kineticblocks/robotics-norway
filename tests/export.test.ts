import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { EXPORT_COLUMNS, membersToCsv, membersToXlsx } from "../lib/export-members";
import type { MemberRecord } from "../lib/types";

const member: MemberRecord = {
  id: "1",
  slug: "example",
  membershipType: "organisation",
  affiliation: null,
  companyName: 'Example, "Robotics"',
  website: "https://example.no",
  logoUrl: null,
  description: "Line one\nLine two",
  contactPerson: "Ada",
  contactEmail: "ada@example.no",
  status: "approved",
  source: "founding",
  joinedAt: "2026-11-05T09:00:00.000Z",
};

test("csv export quotes special characters and uses the mailing columns", () => {
  const csv = membersToCsv([member]);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.match(csv, /membership type,company,affiliation,website,contact person,email,description,status,joined date/);
  assert.match(csv, /"Example, ""Robotics"""/);
  assert.match(csv, /"Line one\nLine two"/);
  assert.match(csv, /2026-11-05/);
  assert.equal(EXPORT_COLUMNS.length, 9);
});

test("xlsx export round-trips the same columns", () => {
  const book = XLSX.read(membersToXlsx([member]));
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(book.Sheets.Members);
  assert.equal(rows[0].company, 'Example, "Robotics"');
  assert.equal(rows[0].email, "ada@example.no");
  assert.equal(rows[0].status, "approved");
  assert.equal(rows[0]["joined date"], "2026-11-05");
});
