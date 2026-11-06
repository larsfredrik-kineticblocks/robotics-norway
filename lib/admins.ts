const DEFAULT_ADMIN = "lars.fredrik@kineticblocks.com";

export function adminEmails() {
  const raw = process.env.ADMIN_EMAILS ?? "";
  const extras = raw
    .split(/[,;\s]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([DEFAULT_ADMIN, ...extras]));
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export function googleAuthConfigured() {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET,
  );
}
