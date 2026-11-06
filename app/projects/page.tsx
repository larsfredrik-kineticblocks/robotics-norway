import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects anchored in the Robotics Norway network.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Projects</p>
      <h1 className="mt-3 font-heading text-4xl text-navy sm:text-5xl">Projects</h1>
      <p className="mt-5 max-w-2xl leading-7">
        Work the network takes on together. Further projects will be added here as they are adopted.
      </p>
      <ul className="mt-12 grid gap-6">
        {projects.map((project) => (
          <li key={project.slug} className="border border-border p-6 sm:p-8">
            <p className="font-heading text-sm tracking-wide text-flag">{project.status}</p>
            <h2 className="mt-2 font-heading text-3xl text-navy">
              <Link href={`/projects/${project.slug}`} className="hover:underline">
                {project.title}
              </Link>
            </h2>
            <p className="mt-4 max-w-3xl leading-7">{project.summary}</p>
            <Link href={`/projects/${project.slug}`} className="mt-6 inline-block font-heading text-sm tracking-wide text-navy hover:underline">
              Read the project
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
