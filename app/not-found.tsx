import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">404</p>
      <h1 className="mt-3 font-heading text-4xl text-navy">Page not found</h1>
      <p className="mt-4 leading-7">That address is not part of Robotics Norway.</p>
      <Link href="/" className="mt-6 inline-block font-heading text-sm tracking-wide text-navy hover:underline">
        Back to the front page
      </Link>
    </div>
  );
}
