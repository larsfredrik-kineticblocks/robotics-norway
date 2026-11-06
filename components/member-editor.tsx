"use client";

import { useActionState } from "react";
import { updateMember } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { idleState } from "@/lib/form-state";
import type { MemberRecord } from "@/lib/types";

export function MemberEditor({ member }: { member: MemberRecord }) {
  const [state, action, pending] = useActionState(updateMember, idleState);
  const httpLogo = member.logoUrl?.startsWith("http") ? member.logoUrl : "";

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="id" value={member.id} />
      <input type="hidden" name="existingLogo" value={member.logoUrl ?? ""} />
      {state.message ? <p className="text-sm text-flag">{state.message}</p> : null}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company</Label>
        <Input id="companyName" name="companyName" defaultValue={member.companyName} className="h-11 md:text-base" />
        {state.fieldErrors.companyName ? <p className="text-sm text-flag">{state.fieldErrors.companyName}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" defaultValue={member.website ?? ""} className="h-11 md:text-base" />
        {state.fieldErrors.website ? <p className="text-sm text-flag">{state.fieldErrors.website}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" name="logoUrl" defaultValue={httpLogo} className="h-11 md:text-base" />
        {member.logoUrl && !httpLogo ? <p className="text-sm text-muted-foreground">An uploaded logo is already stored.</p> : null}
        <Label htmlFor="logoFile">Replace with a file</Label>
        <Input id="logoFile" name="logoFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="removeLogo" /> Remove logo
        </label>
        {state.fieldErrors.logo ? <p className="text-sm text-flag">{state.fieldErrors.logo}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={member.description} className="min-h-32 md:text-base" />
        {state.fieldErrors.description ? <p className="text-sm text-flag">{state.fieldErrors.description}</p> : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input id="contactPerson" name="contactPerson" defaultValue={member.contactPerson ?? ""} className="h-11 md:text-base" />
          {state.fieldErrors.contactPerson ? <p className="text-sm text-flag">{state.fieldErrors.contactPerson}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" defaultValue={member.contactEmail ?? ""} className="h-11 md:text-base" />
          {state.fieldErrors.contactEmail ? <p className="text-sm text-flag">{state.fieldErrors.contactEmail}</p> : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" defaultValue={member.status} className="h-11 w-full rounded-lg border border-input bg-white px-3">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <Button type="submit" disabled={pending} className="h-11 px-6">
        {pending ? "Saving…" : "Save member"}
      </Button>
    </form>
  );
}
