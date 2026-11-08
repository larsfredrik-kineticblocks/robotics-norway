import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { MemberGrid } from "@/components/member-grid";
import { buttonVariants } from "@/components/ui/button";
import { getPublicMembers } from "@/lib/member-repository";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Members",
  description: "Companies, organisations and individual members of Robotics Norway.",
};

async function Directory() {
  await connection();
  const members = await getPublicMembers();
  return <MemberGrid members={members} />;
}

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Members</p>
          <h1 className="mt-3 font-heading text-4xl text-navy sm:text-5xl">The network</h1>
          <p className="mt-5 leading-7">
            Companies, organisations and individuals that were present at, or part of, the founding meeting on 5 November 2026 at Startuplab in Oslo. New members apply and stay pending until an administrator approves them.
          </p>
        </div>
        <Link href="/join" className={cn(buttonVariants({ size: "lg" }), "h-11 bg-flag px-5 text-white hover:bg-flag/90")}>
          Join Robotics Norway
        </Link>
      </div>
      <div className="mt-12">
        <Suspense fallback={<p className="text-muted-foreground">Loading members…</p>}>
          <Directory />
        </Suspense>
      </div>
    </div>
  );
}
