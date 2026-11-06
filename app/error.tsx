"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="font-heading text-4xl text-navy">Something went wrong</h1>
      <p className="mt-4 leading-7">The page could not be loaded. Try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 h-11 rounded-lg bg-navy px-5 font-heading text-sm tracking-wide text-white"
      >
        Try again
      </button>
    </div>
  );
}
