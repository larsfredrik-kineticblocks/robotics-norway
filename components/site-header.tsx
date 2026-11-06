"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/documents", label: "Documents" },
  { href: "/members", label: "Members" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Navigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-end gap-6">
      <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "font-heading text-sm tracking-wide text-navy/80 hover:text-navy",
              isActive(pathname, link.href) &&
                "text-navy underline decoration-flag decoration-2 underline-offset-8",
            )}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Link
          href="/join"
          className={cn(buttonVariants({ size: "lg" }), "h-10 bg-flag px-4 text-white hover:bg-flag/90")}
        >
          Join
        </Link>
        <Button
          type="button"
          variant="outline"
          className="h-10 px-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-b border-border bg-white px-5 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 font-heading text-base text-navy"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

function CurrentNavigation() {
  const pathname = usePathname();
  return <Navigation pathname={pathname} />;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="h-1 bg-flag" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="shrink-0" aria-label="Robotics Norway, home">
          <Image
            src="/brand/robotics-norway-logo.png"
            alt="Robotics Norway"
            width={2048}
            height={433}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>
        <Suspense fallback={<Navigation pathname="" />}>
          <CurrentNavigation />
        </Suspense>
      </div>
    </header>
  );
}
