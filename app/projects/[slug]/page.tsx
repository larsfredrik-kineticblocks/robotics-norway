import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project?.title ?? "Project",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
      </p>
      <p className="mt-4 font-heading text-sm tracking-wide text-navy">{project.status}</p>
      <h1 className="mt-2 font-heading text-4xl text-navy sm:text-5xl">{project.title}</h1>
      <p className="mt-6 text-lg leading-8">{project.summary}</p>
      <div className="mt-8 space-y-5 leading-7">
        {project.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h2 className="mt-12 font-heading text-2xl text-navy">Planned elements</h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-7">
        {project.elements.map((element) => (
          <li key={element}>{element}</li>
        ))}
      </ul>
      <h2 className="mt-12 font-heading text-2xl text-navy">Timeline in the materials</h2>
      <ol className="mt-4 divide-y divide-border border-y border-border">
        {project.timeline.map((item) => (
          <li key={item.when} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
            <span className="font-heading text-navy">{item.when}</span>
            <span className="leading-7">{item.what}</span>
          </li>
        ))}
      </ol>
      <p className="mt-8 leading-7">{project.interested}</p>
      <p className="mt-8 text-sm leading-6 text-muted-foreground">{project.note}</p>
    </article>
  );
}
