"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatCenteredText } from "@phosphor-icons/react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#e4e4e7] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white group-hover:bg-brand-700 transition-colors">
            <ChatCenteredText size={17} weight="bold" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-ink-900">TicketFlow</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-[14px] font-medium text-ink-600 hover:text-ink-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white rounded-lg text-[14px] font-semibold transition-all shadow-sm shadow-brand-500/20"
          >
            Get started free
          </Link>
        </div>
      </div>
    </header>
  );
}
