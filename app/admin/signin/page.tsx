import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { googleAuthConfigured, isAdminEmail } from "@/lib/admins";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

async function SignInScreen({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();
  const params = await searchParams;
  const session = await auth();
  const email = session?.user?.email ?? null;
  const configured = googleAuthConfigured();

  if (email && isAdminEmail(email) && params.error !== "AccessDenied") {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-20">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Admin</p>
      <h1 className="mt-3 font-heading text-4xl text-navy">Sign in</h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        Google sign-in is limited to the administrator allowlist. The default administrator is lars.fredrik@kineticblocks.com. Add further addresses in ADMIN_EMAILS.
      </p>
      {params.error === "AccessDenied" ? (
        <p className="mt-6 border border-flag/30 bg-flag/5 px-4 py-3 text-sm text-flag" role="alert">
          This Google account is not on the administrator list.
        </p>
      ) : null}
      {!configured ? (
        <p className="mt-6 border border-border bg-paper px-4 py-3 text-sm leading-6">
          Google sign-in is not configured. Set AUTH_SECRET, AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET. Until then the admin area stays closed.
        </p>
      ) : (
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <Button type="submit" className="h-11 px-5">
            Sign in with Google
          </Button>
        </form>
      )}
      {email ? (
        <form
          className="mt-4"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/signin" });
          }}
        >
          <Button type="submit" variant="outline" className="h-11 px-5">
            Sign out
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted-foreground">Loading…</p>}>
      <SignInScreen searchParams={searchParams} />
    </Suspense>
  );
}
