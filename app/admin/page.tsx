import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { deleteMember, updateStatus } from "@/app/admin/actions";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { isAdminEmail } from "@/lib/admins";
import { listAllMembers } from "@/lib/member-repository";
import { databaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

function DeleteForm({ id }: { id: string }) {
  return (
    <form action={deleteMember}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" className="h-8 px-3">
        Delete
      </Button>
    </form>
  );
}

async function AdminScreen({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  await connection();
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (!email || !isAdminEmail(email)) redirect("/admin/signin");

  const params = await searchParams;
  const filter = params.status;
  const listed = await listAllMembers();
  const members =
    filter === "pending" || filter === "approved" || filter === "rejected"
      ? listed.members.filter((member) => member.status === filter)
      : listed.members;
  const database = databaseConfigured() && listed.database;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Admin</p>
          <h1 className="mt-3 font-heading text-4xl text-navy">Members</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/signin" });
          }}
        >
          <Button type="submit" variant="outline" className="h-10 px-4">
            Sign out
          </Button>
        </form>
      </div>

      {!database ? (
        <p className="mt-8 border border-border bg-paper px-4 py-3 text-sm leading-6">
          DATABASE_URL is not set, so this list is the bundled founding directory and cannot be edited here. Connect Postgres to approve applications and export the mailing list.
        </p>
      ) : null}
      {params.error === "database" ? (
        <p className="mt-4 text-sm text-flag">That change could not be saved.</p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <Link
            key={status}
            href={status === "all" ? "/admin" : `/admin?status=${status}`}
            className="font-heading tracking-wide text-navy capitalize hover:underline"
          >
            {status}
          </Link>
        ))}
        {database ? (
          <>
            <a className="font-heading tracking-wide text-flag hover:underline" href="/api/admin/export?format=csv">
              Export CSV
            </a>
            <a className="font-heading tracking-wide text-flag hover:underline" href="/api/admin/export?format=xlsx">
              Export XLSX
            </a>
          </>
        ) : null}
      </div>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {members.map((member) => (
          <li key={member.id} className="grid gap-3 py-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-heading text-lg text-navy">{member.companyName}</p>
              <p className="text-sm text-muted-foreground">
                {member.membershipType === "individual" ? "Individual" : "Organisation"} · {member.status} · {member.contactPerson ?? "No contact"} · {member.contactEmail ?? "No email"}
              </p>
            </div>
            {database ? (
              <div className="flex flex-wrap gap-2">
                {member.status !== "approved" ? (
                  <form action={updateStatus}>
                    <input type="hidden" name="id" value={member.id} />
                    <input type="hidden" name="status" value="approved" />
                    <Button type="submit" className="h-8 px-3">
                      Approve
                    </Button>
                  </form>
                ) : null}
                {member.status !== "rejected" ? (
                  <form action={updateStatus}>
                    <input type="hidden" name="id" value={member.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <Button type="submit" variant="outline" className="h-8 px-3">
                      Reject
                    </Button>
                  </form>
                ) : null}
                <Link href={`/admin/members/${member.id}`} className="inline-flex h-8 items-center px-3 font-heading text-sm text-navy hover:underline">
                  Edit
                </Link>
                <DeleteForm id={member.id} />
              </div>
            ) : null}
          </li>
        ))}
        {members.length === 0 ? <li className="py-6 text-sm text-muted-foreground">Nothing in this list.</li> : null}
      </ul>
    </div>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted-foreground">Checking access…</p>}>
      <AdminScreen searchParams={searchParams} />
    </Suspense>
  );
}
