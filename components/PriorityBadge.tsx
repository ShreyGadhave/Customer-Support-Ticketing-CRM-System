// PriorityBadge — colored pill for Low / Medium / High / Urgent.
// Uses rounded-md (not rounded-full) to match the mockup — priority pills are
// slightly more rectangular than status pills.

import type { TicketPriority } from "@/lib/types";

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  Urgent: "bg-red-50    text-red-700    border border-red-100",
  High:   "bg-orange-50 text-orange-600 border border-orange-100",
  Medium: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  Low:    "bg-gray-100  text-gray-600   border border-gray-200",
};

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-tighter ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}
