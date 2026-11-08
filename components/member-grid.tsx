import Link from "next/link";
import { MemberMark } from "@/components/member-mark";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { websiteLabel } from "@/lib/text";
import type { MemberRecord } from "@/lib/types";

export function IndividualCard({ member }: { member: MemberRecord }) {
  return (
    <Card id={member.slug} className="scroll-mt-28">
      <CardHeader className="flex-row items-center gap-4">
        <MemberMark name={member.companyName} logoUrl={null} />
        <div>
          <h3 className="font-heading text-xl leading-snug text-navy">{member.companyName}</h3>
          {member.affiliation ? <p className="mt-1 text-sm text-muted-foreground">{member.affiliation}</p> : null}
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-6 text-ink">{member.description}</p>
        {member.website ? (
          <a
            href={member.website}
            className="mt-4 inline-block text-sm text-flag hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {websiteLabel(member.website)}
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}

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

export function MemberDirectory({ members }: { members: MemberRecord[] }) {
  const organisations = members.filter((member) => member.membershipType !== "individual");
  const individuals = members.filter((member) => member.membershipType === "individual");

  if (organisations.length === 0 && individuals.length === 0) {
    return (
      <p className="text-muted-foreground">
        No members are published yet. Companies and individuals can{" "}
        <Link className="text-navy underline" href="/join">
          apply to join
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-16">
      {organisations.length > 0 ? (
        <ul className="grid gap-5 md:grid-cols-2">
          {organisations.map((member) => (
            <li key={member.id}>
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      ) : null}
      {individuals.length > 0 ? (
        <section aria-labelledby="individual-members">
          <h2 id="individual-members" className="font-heading text-3xl text-navy">
            Individual members
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {individuals.map((member) => (
              <li key={member.id}>
                <IndividualCard member={member} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function MemberGrid({ members }: { members: MemberRecord[] }) {
  return <MemberDirectory members={members} />;
}
