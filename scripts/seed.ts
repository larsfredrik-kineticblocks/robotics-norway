import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";
import { publicMembers } from "../lib/members";
import { members } from "../lib/db/schema";

export async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. The bundled member list is used instead.");
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema: { members } });
  const founding = publicMembers();
  let inserted = 0;
  let updated = 0;

  try {
    for (const member of founding) {
      const existing = await db
        .select()
        .from(members)
        .where(sql`lower(${members.companyName}) = ${member.companyName.toLowerCase()}`)
        .limit(1);

      const values = {
        membershipType: member.membershipType,
        companyName: member.companyName,
        affiliation: member.affiliation,
        website: member.website,
        logoUrl: member.logoUrl,
        description: member.description,
        contactPerson: member.contactPerson,
        contactEmail: member.contactEmail,
        status: "approved",
        source: "founding",
        joinedAt: new Date("2026-11-05T09:00:00.000Z"),
        updatedAt: new Date(),
      };

      if (existing[0]) {
        await db.update(members).set(values).where(eq(members.id, existing[0].id));
        updated += 1;
      } else {
        await db.insert(members).values(values);
        inserted += 1;
      }
    }
  } finally {
    await pool.end();
  }

  console.log(`Seeded founding members. Inserted ${inserted}, updated ${updated}.`);
}

export async function applySchema() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }
  const pool = new Pool({ connectionString });
  try {
    const directory = path.join(process.cwd(), "drizzle");
    const files = readdirSync(directory)
      .filter((file) => file.endsWith(".sql"))
      .sort();
    for (const file of files) {
      await pool.query(readFileSync(path.join(directory, file), "utf8"));
      console.log(`Applied drizzle/${file}`);
    }
  } finally {
    await pool.end();
  }
}

const isDirect =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirect) {
  seed().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
