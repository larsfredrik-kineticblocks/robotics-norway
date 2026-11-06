import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { MemberEditor } from "@/components/member-editor";
import { isAdminEmail } from "@/lib/admins";
import { getMember } from "@/lib/member-repository";

export const metadata: Metadata = {
  title: "Edit member",
  robots: { index: false, follow: false },
};

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!email || !isAdminEmail(email)) redirect("/admin/signin");
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/admin" className="font-heading text-sm tracking-wide text-flag hover:underline">
        Back to admin
      </Link>
      <h1 className="mt-4 font-heading text-4xl text-navy">Edit {member.companyName}</h1>
      <MemberEditor member={member} />
    </div>
  );
}

export default function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted-foreground">Loading member…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}
