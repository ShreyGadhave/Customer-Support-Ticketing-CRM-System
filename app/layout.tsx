import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// ---------------------------------------------------------------------------
// Root layout — minimal shell that applies fonts and global CSS.
// The Sidebar lives in app/(dashboard)/layout.tsx so it only renders for
// authenticated app routes, not the landing page or auth pages.
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: { default: "TicketFlow", template: "%s | TicketFlow" },
  description: "AI-powered customer support ticket management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-white text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
