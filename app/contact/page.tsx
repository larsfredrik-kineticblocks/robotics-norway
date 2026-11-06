import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the administrator of Robotics Norway.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Contact</p>
      <h1 className="mt-3 font-heading text-4xl text-navy sm:text-5xl">Lars-Fredrik Forberg</h1>
      <p className="mt-4 font-heading text-xl text-navy">Administrator</p>
      <p className="mt-6 leading-7">
        Lars-Fredrik Forberg is the administrator contact for Robotics Norway. He facilitated the founding meeting at Startuplab in Oslo on 5 November 2026.
      </p>
      <p className="mt-6">
        <a
          className="font-heading text-lg text-flag hover:underline"
          href="mailto:lars.fredrik@kineticblocks.com"
        >
          lars.fredrik@kineticblocks.com
        </a>
      </p>
    </div>
  );
}
