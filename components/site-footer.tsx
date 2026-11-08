import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-heading text-lg text-navy">Robotics Norway</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Founded 5 November 2026 at Startuplab, Oslo. Administrator: Lars-Fredrik Forberg,{" "}
            <a className="text-navy underline decoration-border underline-offset-4" href="mailto:lars.fredrik@kineticblocks.com">
              lars.fredrik@kineticblocks.com
            </a>
            .
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Footer">
          <Link className="text-navy hover:underline" href="/documents">
            Documents
          </Link>
          <Link className="text-navy hover:underline" href="/members">
            Members
          </Link>
          <Link className="text-navy hover:underline" href="/news">
            News
          </Link>
          <Link className="text-navy hover:underline" href="/search">
            Search
          </Link>
          <Link className="text-navy hover:underline" href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
