"use client";

import { useActionState } from "react";
import { submitApplication } from "@/app/join/actions";
import { idleState } from "@/lib/form-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-flag">{message}</p>;
}

export function JoinForm() {
  const [state, action, pending] = useActionState(submitApplication, idleState);

  if (state.status === "success") {
    return (
      <div className="border border-border bg-paper p-6" role="status">
        <h2 className="font-heading text-2xl text-navy">Application received</h2>
        <p className="mt-3 leading-7">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      {state.message ? (
        <p className="border border-flag/30 bg-flag/5 px-4 py-3 text-sm text-flag" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input id="companyName" name="companyName" required autoComplete="organization" className="h-11 md:text-base" aria-invalid={Boolean(state.fieldErrors.companyName)} />
        <FieldError message={state.fieldErrors.companyName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" type="url" required placeholder="https://" inputMode="url" className="h-11 md:text-base" aria-invalid={Boolean(state.fieldErrors.website)} />
        <FieldError message={state.fieldErrors.website} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input id="logoUrl" name="logoUrl" type="url" placeholder="https://" className="h-11 md:text-base" aria-invalid={Boolean(state.fieldErrors.logo)} />
        <Label htmlFor="logoFile" className="pt-2 text-muted-foreground">
          Or upload a logo (PNG, JPEG, WebP, GIF or SVG, up to 150 KB)
        </Label>
        <Input id="logoFile" name="logoFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="h-11 md:text-base" />
        <FieldError message={state.fieldErrors.logo} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Short description</Label>
        <Textarea id="description" name="description" required minLength={20} maxLength={600} rows={5} className="min-h-32 md:text-base" aria-invalid={Boolean(state.fieldErrors.description)} />
        <FieldError message={state.fieldErrors.description} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input id="contactPerson" name="contactPerson" required autoComplete="name" className="h-11 md:text-base" aria-invalid={Boolean(state.fieldErrors.contactPerson)} />
          <FieldError message={state.fieldErrors.contactPerson} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Company email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" required autoComplete="email" className="h-11 md:text-base" aria-invalid={Boolean(state.fieldErrors.contactEmail)} />
          <FieldError message={state.fieldErrors.contactEmail} />
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="consent" name="consent" required aria-invalid={Boolean(state.fieldErrors.consent)} />
        <Label htmlFor="consent" className="items-start leading-6 font-normal">
          I confirm that I am authorised to apply on behalf of this company, and that Robotics Norway may store these details and contact us about membership.
        </Label>
      </div>
      <FieldError message={state.fieldErrors.consent} />
      <Button type="submit" disabled={pending} className="h-11 px-6">
        {pending ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
