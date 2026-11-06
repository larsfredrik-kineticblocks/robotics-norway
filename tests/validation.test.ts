import assert from "node:assert/strict";
import test from "node:test";
import { parseApplication, parseMemberEdit } from "../lib/validation";

const valid = {
  companyName: "Example Robotics",
  website: "example.no",
  logoUrl: "",
  description: "Builds inspection robots for Norwegian industry.",
  contactPerson: "Ada Norway",
  contactEmail: "ada@example.no",
  consent: true,
  logoDataUrl: null,
};

test("join form accepts a normalised application", () => {
  const parsed = parseApplication(valid);
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(parsed.data.website, "https://example.no");
    assert.equal(parsed.data.contactEmail, "ada@example.no");
  }
});

test("join form requires consent, a real email and a description", () => {
  const parsed = parseApplication({
    ...valid,
    contactEmail: "not-an-email",
    description: "too short",
    consent: false,
  });
  assert.equal(parsed.ok, false);
  if (!parsed.ok) {
    assert.match(parsed.fieldErrors.contactEmail, /email/i);
    assert.match(parsed.fieldErrors.description, /20/);
    assert.match(parsed.fieldErrors.consent, /Consent/);
  }
});

test("logo upload must be a small image data url", () => {
  const parsed = parseApplication({
    ...valid,
    logoDataUrl: "data:text/plain;base64,aGVsbG8=",
  });
  assert.equal(parsed.ok, false);
  if (!parsed.ok) assert.match(parsed.fieldErrors.logo, /PNG/);
});

test("admin edit does not require the public consent box", () => {
  const parsed = parseMemberEdit({ ...valid, status: "approved" });
  assert.equal(parsed.ok, true);
});
