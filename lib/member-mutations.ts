import { connection } from "next/server";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admins";
import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";
import type { ActionState } from "@/lib/form-state";
import { findMemberByCompanyName } from "@/lib/member-repository";
import type { ApplicationInput } from "@/lib/validation";

export async function requireAdminEmail() {
  await connection();
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (!email || !isAdminEmail(email)) return null;
  return { email, name: session?.user?.name ?? email };
}

export async function insertApplication(data: ApplicationInput): Promise<ActionState> {
  const db = getDb();
  if (!db) {
    return {
      status: "error",
      message:
        "The application is valid, but this server has no member database yet, so it was not stored. An administrator needs to set DATABASE_URL.",
      fieldErrors: {},
    };
  }

  const existing = await findMemberByCompanyName(data.companyName);
  if (existing?.status === "approved") {
    return {
      status: "error",
      message: "This company is already a member.",
      fieldErrors: { companyName: "This company is already a member." },
    };
  }
  if (existing?.status === "pending") {
    return {
      status: "error",
      message: "An application for this company is already pending.",
      fieldErrors: { companyName: "An application for this company is already pending." },
    };
  }

  const values = {
    companyName: data.companyName,
    website: data.website,
    logoUrl: data.logoUrl,
    description: data.description,
    contactPerson: data.contactPerson,
    contactEmail: data.contactEmail,
    status: "pending" as const,
    source: "application" as const,
    consentAt: new Date(),
    updatedAt: new Date(),
    joinedAt: null,
  };

  if (existing) {
    await db
      .update(members)
      .set(values)
      .where(sql`lower(${members.companyName}) = ${data.companyName.toLowerCase()}`);
  } else {
    await db.insert(members).values(values);
  }

  return {
    status: "success",
    message:
      "Application received. It is stored as pending until an administrator approves it. The company will not appear on the public member list before then.",
    fieldErrors: {},
  };
}

export async function setMemberStatus(id: number, status: "approved" | "rejected") {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const current = await db.select().from(members).where(eq(members.id, id)).limit(1);
  if (!current[0]) return false;
  await db
    .update(members)
    .set({
      status,
      updatedAt: new Date(),
      joinedAt: status === "approved" ? (current[0].joinedAt ?? new Date()) : current[0].joinedAt,
    })
    .where(eq(members.id, id));
  return true;
}

export async function saveMember(
  id: number,
  data: ApplicationInput & { status: "approved" | "pending" | "rejected" },
) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  const clash = await db
    .select()
    .from(members)
    .where(sql`lower(${members.companyName}) = ${data.companyName.toLowerCase()}`)
    .limit(1);
  if (clash[0] && clash[0].id !== id) {
    return { ok: false as const, message: "Another member already uses this company name." };
  }
  const current = await db.select().from(members).where(eq(members.id, id)).limit(1);
  if (!current[0]) return { ok: false as const, message: "Member not found." };
  await db
    .update(members)
    .set({
      companyName: data.companyName,
      website: data.website,
      logoUrl: data.logoUrl,
      description: data.description,
      contactPerson: data.contactPerson,
      contactEmail: data.contactEmail,
      status: data.status,
      updatedAt: new Date(),
      joinedAt:
        data.status === "approved" ? (current[0].joinedAt ?? new Date()) : current[0].joinedAt,
    })
    .where(eq(members.id, id));
  return { ok: true as const };
}

export async function removeMember(id: number) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");
  await db.delete(members).where(eq(members.id, id));
}
