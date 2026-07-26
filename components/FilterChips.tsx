"use client";

// FilterChips — All / Open / In Progress / Closed pill buttons.
// The selected chip gets brand-600 background; others are muted.
// Lifts selected value to parent via onChange.

import type { TicketStatus } from "@/lib/types";

type FilterValue = "All" | TicketStatus;

const CHIPS: FilterValue[] = ["All", "Open", "In Progress", "Closed"];

interface FilterChipsProps {
  selected: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function FilterChips({ selected, onChange }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      {CHIPS.map((chip) => {
        const isActive = selected === chip;
        return (
          <button
            key={chip}
            onClick={() => onChange(chip)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              isActive
                ? "bg-brand-600 text-white font-bold"
                : "text-ink-600 hover:bg-gray-100"
            }`}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
