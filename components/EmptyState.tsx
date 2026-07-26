"use client";

// EmptyState — shown when GET /api/tickets returns an empty array.
// Matches the mockup: icon, heading, subtext, CTA button.

import { useRouter } from "next/navigation";
import { Ticket } from "@phosphor-icons/react";

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-2xl p-12 lg:p-24 flex flex-col items-center text-center shadow-sm">
      {/* Icon circle */}
      <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-8">
        <Ticket size={48} className="text-brand-600" />
      </div>

      <h2 className="text-[24px] font-bold text-ink-900">No tickets found</h2>
      <p className="text-ink-400 mt-2 max-w-md mx-auto text-[15px]">
        It looks like your queue is empty. You&apos;re all caught up! When new
        customer requests arrive, they&apos;ll appear here.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/tickets/new")}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
        >
          Create your first ticket
        </button>
        <button
          className="px-8 py-3 border border-gray-200 text-ink-600 hover:bg-gray-50 rounded-xl text-[14px] font-semibold transition-all"
          disabled
          title="CSV import coming soon"
        >
          Import from CSV
        </button>
      </div>

      {/* Decorative faded skeleton rows — matches empty-loading-state.html */}
      <div className="w-full mt-16 space-y-4 opacity-40 pointer-events-none select-none">
        {[
          ["w-8", "w-40", "w-64", "w-20"],
          ["w-8", "w-36", "w-56", "w-20"],
          ["w-8", "w-44", "w-60", "w-20"],
        ].map((cols, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-4 py-2 border-b border-[#f1f1f3]"
          >
            {cols.map((w, j) => (
              <div
                key={j}
                className={`skeleton h-4 rounded ${w} ${j === cols.length - 1 ? "ml-auto" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
