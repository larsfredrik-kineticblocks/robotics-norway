import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { adminEmails, isAdminEmail } from "../lib/admins";

test("the default administrator stays on the allowlist when more emails are added", () => {
  const previous = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = "ada@example.com, BEA@Example.com";
  try {
    assert.deepEqual(adminEmails().sort(), [
      "ada@example.com",
      "bea@example.com",
      "lars.fredrik@kineticblocks.com",
    ]);
    assert.equal(isAdminEmail("Lars.Fredrik@kineticblocks.com"), true);
    assert.equal(isAdminEmail("other@example.com"), false);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = previous;
  }
});

test("drive sync leaves the bundled index in place without credentials", () => {
  const result = spawnSync("npx", ["tsx", "scripts/sync-drive.ts"], {
    encoding: "utf8",
    env: { ...process.env, GOOGLE_SERVICE_ACCOUNT_JSON: "", DRIVE_FOLDER_ID: "" },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /bundled document index/);
});
