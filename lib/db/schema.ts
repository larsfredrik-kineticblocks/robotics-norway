import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  membershipType: text("membership_type").notNull().default("organisation"),
  companyName: text("company_name").notNull(),
  affiliation: text("affiliation"),
  website: text("website"),
  logoUrl: text("logo_url"),
  description: text("description").notNull().default(""),
  contactPerson: text("contact_person"),
  contactEmail: text("contact_email"),
  status: text("status").notNull().default("pending"),
  source: text("source").notNull().default("application"),
  joinedAt: timestamp("joined_at", { withTimezone: true }),
  consentAt: timestamp("consent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
