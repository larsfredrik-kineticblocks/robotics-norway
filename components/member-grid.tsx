import Link from "next/link";
import { MemberMark } from "@/components/member-mark";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { websiteLabel } from "@/lib/text";
import type { MemberRecord } from "@/lib/types";

export function MemberCard({ member }: { member: MemberRecord }) {
  return (
    <Card id={member.slug} className="scroll-mt-28">
      <CardHeader className="flex-row items-center gap-4">
        <MemberMark name={member.companyName} logoUrl={member.logoUrl} />
        <div>
          <h2 className="font-heading text-xl leading-snug text-navy">{member.companyName}</h2>
          {member.website ? (
            <a
              href={member.website}
              className="mt-1 inline-block text-sm text-flag hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {websiteLabel(member.website)}
            </a>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="leading-6 text-ink">{member.description}</p>
        <dl className="space-y-1 text-sm">
          <div>
            <dt className="inline font-heading text-navy">Contact </dt>
            <dd className="inline">{member.contactPerson ?? "Not yet published"}</dd>
          </div>
          <div>
            <dt className="sr-only">Email</dt>
            <dd>
              {member.contactEmail ? (
                <a className="text-navy underline decoration-border underline-offset-4" href={`mailto:${member.contactEmail}`}>
                  {member.contactEmail}
                </a>
              ) : (
                <span className="text-muted-foreground">Email not yet published</span>
              )}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

export function MemberGrid({ members }: { members: MemberRecord[] }) {
  if (members.length === 0) {
    return (
      <p className="text-muted-foreground">
        No members are published yet. Companies can{" "}
        <Link className="text-navy underline" href="/join">
          apply to join
        </Link>
        .
      </p>
    );
  }
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {members.map((member) => (
        <li key={member.id}>
          <MemberCard member={member} />
        </li>
      ))}
    </ul>
  );
}
