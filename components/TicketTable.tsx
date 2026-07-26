"use client";

// =============================================================================
// TicketTable — desktop table view (hidden on mobile, shown md+).
// Each row navigates to the ticket detail page on click.
// =============================================================================

import { useRouter } from "next/navigation";
import type { Ticket } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import Avatar from "./Avatar";

interface TicketTableProps {
  tickets: Ticket[];
}

/** Format ISO timestamp → "Oct 24, 14:32" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function TicketTable({ tickets }: TicketTableProps) {
  const router = useRouter();

  return (
    // hidden on mobile, shown as table on md+
    <div className="overflow-x-auto hidden md:block">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="text-[11px] font-bold text-ink-400 uppercase tracking-widest bg-[#fcfcfd] border-b border-[#f1f1f3]">
            <th className="py-4 px-6">Ticket ID</th>
            <th className="py-4 px-4">Customer</th>
            <th className="py-4 px-4">Subject</th>
            <th className="py-4 px-4">Priority</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-6 text-right">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f1f3] text-[14px]">
          {tickets.map((ticket, idx) => (
            <tr
              key={ticket.id}
              onClick={() => router.push(`/tickets/${ticket.ticket_id}`)}
              className={`group hover:bg-[#fafafa] transition-colors cursor-pointer ${
                idx % 2 !== 0 ? "bg-[#fcfcfd]/30" : ""
              }`}
            >
              <td className="py-4 px-6 font-bold text-ink-400">
                #{ticket.ticket_id}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar name={ticket.customer_name} size={28} />
                  <span className="font-semibold text-ink-900">
                    {ticket.customer_name}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 font-medium text-ink-600 truncate max-w-[240px]">
                {ticket.subject}
              </td>
              <td className="py-4 px-4">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="py-4 px-4">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="py-4 px-6 text-right text-ink-400 text-[13px]">
                {formatDate(ticket.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
