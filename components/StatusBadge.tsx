// StatusBadge — colored pill for Open / In Progress / Closed.
// Colors match the mockup exactly.

import type { TicketStatus } from "@/lib/types";

const STATUS_STYLES: Record<TicketStatus, string> = {
  Open:         "bg-blue-50   text-blue-700   border border-blue-100",
  "In Progress": "bg-amber-50  text-amber-700  border border-amber-100",
  Closed:       "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

interface StatusBadgeProps {
  status: TicketStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-tighter ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
