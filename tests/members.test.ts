import assert from "node:assert/strict";
import test from "node:test";
import { excludedMembers, missingDescription, publicMembers } from "../lib/members";

test("public members are the founding organisations that were present", () => {
  const names = publicMembers().map((member) => member.companyName);
  assert.deepEqual(names, [
    "3LC",
    "AimadLab",
    "Dotspot",
    "Hive Autonomy",
    "Humanoid.guide",
    "Innovation Norway",
    "Kameleon Robotics",
    "Kinetic Blocks AS",
    "Lito",
    "Marselia Robotics",
    "Mechatronics Innovation Lab",
    "Necia",
    "Norwegian Robotics Cluster",
    "Oslo kommune, Sykehjemsetaten",
    "Physical Robotics",
    "Posten Bring",
    "PPM Robotics",
    "ROBOXI",
    "Runway FBU",
    "Ruter AS",
    "Saro Robotics",
    "Sonair",
    "Startuplab",
  ]);
});

test("uncertain, declined, private and unknown entries are excluded", () => {
  const reasons = Object.fromEntries(
    excludedMembers().map((entry) => [entry.companyName, entry.reason]),
  );
  assert.equal(reasons["Fisker Robotics"], "Flagged uncertain.");
  assert.equal(reasons.Wybe, "Flagged uncertain.");
  assert.equal(reasons.Cognite, "Declined membership.");
  assert.match(reasons["(individual) Laksiya Balasubramaniam"], /Private individual/);
  assert.match(reasons["(unknown organisation)"], /unknown/i);
  assert.equal(Object.keys(reasons).length, 5);
});

test("uncertain websites and unconfirmed logos are not published", () => {
  const byName = Object.fromEntries(publicMembers().map((member) => [member.companyName, member]));
  assert.equal(byName["Marselia Robotics"].website, null);
  assert.equal(byName.Sonair.logoUrl, null);
  assert.equal(byName["Physical Robotics"].contactEmail, null);
  assert.equal(byName.Dotspot.description, missingDescription);
  assert.equal(byName.Dotspot.website, "https://dotspot.ai");
  assert.equal(byName["Oslo kommune, Sykehjemsetaten"].website, "https://www.oslo.kommune.no/");
  assert.equal(byName["Saro Robotics"].contactEmail, "ingeborg@sarorobotics.com");
});
