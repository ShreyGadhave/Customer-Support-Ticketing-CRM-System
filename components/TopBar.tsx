"use client";

// =============================================================================
// TopBar — page header with centered debounced search + "New Ticket" button.
//
// Search is debounced 300ms: the parent passes onSearch which is called after
// the user stops typing, keeping API calls minimal.
// =============================================================================

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";

interface TopBarProps {
  /** Page title shown on the left (lg+ screens) */
  title: string;
  /** Called 300ms after the user stops typing. Pass undefined to hide search. */
  onSearch?: (query: string) => void;
  /** Initial value for the search input */
  searchValue?: string;
  /** Slot for extra right-side content (e.g. back button on detail page) */
  leftSlot?: React.ReactNode;
  /** Hide the New Ticket button on pages that don't need it */
  hideNewTicket?: boolean;
}

export default function TopBar({
  title,
  onSearch,
  searchValue = "",
  leftSlot,
  hideNewTicket = false,
}: TopBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(searchValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if parent resets the value (e.g. filter chip clears search)
  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);

    if (!onSearch) return;

    // Clear any pending debounce, then schedule a new one
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(val), 300);
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <header className="h-[68px] bg-white border-b border-[#e4e4e7] flex items-center justify-between px-7 shrink-0">
      {/* Left: optional slot (back button) + title */}
      <div className="flex items-center gap-2">
        {leftSlot}
        <h1 className="text-[17px] font-semibold hidden lg:block">{title}</h1>
      </div>

      {/* Center: search (only rendered when onSearch is provided) */}
      {onSearch !== undefined && (
        <div className="flex-1 max-w-xl mx-auto px-4">
          <div className="relative group">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-brand-600 transition-colors"
            />
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search tickets, customers..."
              className="w-full pl-10 pr-14 py-2 bg-[#f8f9fa] border border-[#e4e4e7] focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/5 rounded-xl text-[14px] outline-none transition-all"
            />
            {/* ⌘K hint badge */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-ink-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm pointer-events-none">
              ⌘ K
            </div>
          </div>
        </div>
      )}

      {/* Right: New Ticket button */}
      {!hideNewTicket && (
        <button
          onClick={() => router.push("/tickets/new")}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-sm shadow-brand-500/10"
        >
          <Plus size={15} weight="bold" />
          New Ticket
        </button>
      )}
    </header>
  );
}
