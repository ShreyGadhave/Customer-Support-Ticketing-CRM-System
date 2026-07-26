"use client";

// =============================================================================
// TicketCard — mobile stacked card view (shown on mobile, hidden md+).
// Each card navigates to the ticket detail page on click.
// =============================================================================

import { useRouter } from "next/navigation";
import type { Ticket } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import Avatar from "./Avatar";

interface TicketCardProps {
  tickets: Ticket[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TicketCard({ tickets }: TicketCardProps) {
  const router = useRouter();

  return (
    // shown on mobile, hidden md+
    <div className="md:hidden divide-y divide-[#f1f1f3]">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => router.push(`/tickets/${ticket.ticket_id}`)}
          className="p-4 hover:bg-[#fafafa] transition-colors cursor-pointer"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={ticket.customer_name} size={32} />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-ink-900 truncate">
                  {ticket.customer_name}
                </p>
                <p className="text-[11px] font-bold text-ink-400">
                  #{ticket.ticket_id}
                </p>
              </div>
            </div>
            <span className="text-[12px] text-ink-400 shrink-0">
              {formatDate(ticket.created_at)}
            </span>
          </div>

          {/* Subject */}
          <p className="text-[14px] font-medium text-ink-600 truncate mb-3">
            {ticket.subject}
          </p>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      ))}
    </div>
  );
}
