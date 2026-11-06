import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchScreen } from "@/components/search-screen";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Robotics Norway charter, documents and members.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="px-5 py-20 text-muted-foreground">Loading search…</p>}>
      <SearchScreen />
    </Suspense>
  );
}
