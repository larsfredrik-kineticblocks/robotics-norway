import type { Metadata } from "next";
import { Inter, Saira } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { networkSummary } from "@/content/charter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const saira = Saira({
  subsets: ["latin", "latin-ext"],
  variable: "--font-saira",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roboticsnorway.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Robotics Norway",
    template: "%s · Robotics Norway",
  },
  description: networkSummary,
  openGraph: {
    title: "Robotics Norway",
    description: networkSummary,
    url: siteUrl,
    siteName: "Robotics Norway",
    locale: "en",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${saira.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
