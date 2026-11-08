import type { Metadata } from "next";
import Link from "next/link";
import corpus from "@/data/search-corpus.json";
import { formatOsloDate } from "@/lib/export-members";
import type { SearchCorpus } from "@/lib/types";

const data = corpus as SearchCorpus;

export const metadata: Metadata = {
  title: "Documents",
  description: "Index of the Robotics Norway shared documents.",
};

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-heading text-sm tracking-[0.14em] text-flag uppercase">Documents</p>
      <h1 className="mt-3 font-heading text-4xl text-navy sm:text-5xl">Document index</h1>
      <p className="mt-6 max-w-2xl leading-7">{data.sharedDrive.note}</p>
      <p className="mt-4">
        <a className="font-heading text-sm tracking-wide text-flag hover:underline" href={data.sharedDrive.url}>
          Open the shared Drive (members only)
        </a>
      </p>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-navy font-heading text-navy">
              <th className="py-3 pr-4 font-medium">Name</th>
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 pr-4 font-medium">Last modified</th>
              <th className="py-3 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {data.documents.map((document) => (
              <tr key={document.id} className="border-b border-border">
                <td className="py-4 pr-4">
                  <Link href={`/documents/${document.slug}`} className="text-navy hover:underline">
                    {document.name}
                  </Link>
                  {document.summary ? <p className="mt-1 max-w-xl leading-6 text-muted-foreground">{document.summary}</p> : null}
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{document.type}</td>
                <td className="py-4 pr-4 text-muted-foreground">{formatOsloDate(document.lastModified)}</td>
                <td className="py-4">
                  <a className="text-flag hover:underline" href={document.link} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
