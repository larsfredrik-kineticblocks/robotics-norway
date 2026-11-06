import type { Metadata } from "next";
import { JoinForm } from "@/components/join-form";

export const metadata: Metadata = {
  title: "Join",
  description: "Apply for your company to join Robotics Norway.",
};

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Membership</p>
      <h1 className="mt-3 font-heading text-4xl text-navy">Join Robotics Norway</h1>
      <p className="mt-5 leading-7">
        Companies and organisations in robotics and physical AI can apply here. Applications are stored as pending and are published only after an administrator approves them.
      </p>
      <div className="mt-10">
        <JoinForm />
      </div>
    </div>
  );
}
