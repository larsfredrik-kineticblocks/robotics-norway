"use client";

import { useState } from "react";
import { initials } from "@/lib/text";

export function MemberMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!logoUrl || failed) {
    return (
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-md bg-paper font-heading text-lg text-navy"
        aria-hidden
      >
        {initials(name)}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt=""
      className="size-14 shrink-0 rounded-md bg-paper object-contain"
      onError={() => setFailed(true)}
    />
  );
}
