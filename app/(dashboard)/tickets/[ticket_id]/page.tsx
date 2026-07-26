"use client";

// Ticket Detail — /tickets/[ticket_id]
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Envelope, DotsThreeOutline } from "@phosphor-icons/react";

import type {
  TicketWithNotes,
  TicketStatus,
  TicketPriority,
} from "@/lib/types";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import AIInsightCard from "@/components/AIInsightCard";
import NotesThread from "@/components/NotesThread";

const STATUS_SELECT_STYLE: Record<TicketStatus, string> = {
  Open: "bg-blue-50   text-blue-700",
  "In Progress": "bg-amber-50  text-amber-700",
  Closed: "bg-emerald-50 text-emerald-700",
};
const PRIORITY_SELECT_STYLE: Record<TicketPriority, string> = {
  Urgent: "bg-red-50    text-red-700",
  High: "bg-orange-50 text-orange-600",
  Medium: "bg-yellow-50 text-yellow-700",
  Low: "bg-gray-100  text-gray-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.ticket_id as string;
  const [ticket, setTicket] = useState<TicketWithNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [assignee, setAssignee] = useState<{ name: string; email: string } | null>(null);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      const supabase = getSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAssignee({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Agent',
          email: user.email || '',
        });
      }
    }
    fetchUser();
  }, []);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      if (res.status === 404) {
        setError("Ticket not found.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load ticket");
      setTicket(await res.json());
    } catch {
      setError("Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  async function updateField(field: "status" | "priority", value: string) {
    if (!ticket) return;
    setUpdating(true);
    setTicket((prev) => (prev ? { ...prev, [field]: value } : prev));
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) await fetchTicket();
    } catch {
      await fetchTicket();
    } finally {
      setUpdating(false);
    }
  }

  if (loading)
    return (
      <>
        <header className="h-[68px] bg-white border-b border-[#e4e4e7] flex items-center px-7 gap-4 shrink-0">
          <Link
            href="/tickets"
            className="p-2 -ml-2 text-ink-400 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="skeleton h-5 w-48 rounded" />
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-2xl px-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-6 rounded-lg w-full" />
            ))}
          </div>
        </div>
      </>
    );

  if (error || !ticket)
    return (
      <>
        <header className="h-[68px] bg-white border-b border-[#e4e4e7] flex items-center px-7 gap-4 shrink-0">
          <Link
            href="/tickets"
            className="p-2 -ml-2 text-ink-400 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>
          <span className="text-[14px] font-bold text-ink-400">
            #{ticketId}
          </span>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[16px] text-ink-600 mb-4">
              {error ?? "Ticket not found"}
            </p>
            <Link
              href="/tickets"
              className="text-brand-600 underline text-[14px]"
            >
              Back to tickets
            </Link>
          </div>
        </div>
      </>
    );

  return (
    <>
      <header className="h-[68px] bg-white border-b border-[#e4e4e7] flex items-center justify-between px-7 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/tickets"
            className="p-2 -ml-2 text-ink-400 hover:bg-gray-100 rounded-lg shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[14px] font-bold text-ink-400 shrink-0">
              #{ticket.ticket_id}
            </span>
            <h1 className="text-[17px] font-semibold truncate hidden sm:block">
              {ticket.subject}
            </h1>
            <div className="flex gap-2 shrink-0">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="p-2 text-ink-400 hover:bg-gray-100 rounded-lg">
            <DotsThreeOutline size={20} />
          </button>
          <button
            onClick={() => updateField("status", "Closed")}
            disabled={updating || ticket.status === "Closed"}
            className="ml-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg text-[13px] font-medium transition-colors"
          >
            {ticket.status === "Closed" ? "Resolved" : "Resolve"}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Left: description + notes */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-8 py-8 space-y-10">
            <div className="flex items-start justify-between p-6 bg-[#f8f9fa] rounded-2xl border border-[#e4e4e7]">
              <div className="flex items-center gap-4">
                <Avatar name={ticket.customer_name} size={48} />
                <div>
                  <h3 className="text-[15px] font-bold text-ink-900">
                    {ticket.customer_name}
                  </h3>
                  <p className="text-[13px] text-ink-400">
                    {ticket.customer_email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">
                  Reported via
                </p>
                <p className="text-[13px] font-medium text-ink-600 flex items-center justify-end gap-1.5 mt-0.5">
                  <Envelope size={14} weight="fill" /> Email Support
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-ink-900">
                  Description
                </h2>
                <span className="text-[12px] text-ink-400">
                  {formatDate(ticket.created_at)}
                </span>
              </div>
              <div className="text-[15px] text-ink-600 leading-relaxed whitespace-pre-wrap">
                {ticket.description || (
                  <span className="text-ink-300 italic">
                    No description provided.
                  </span>
                )}
              </div>
            </div>

            <NotesThread
              ticketId={ticket.ticket_id}
              notes={ticket.notes}
              onNoteAdded={fetchTicket}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-[300px] xl:w-[320px] bg-[#fdfdfe] border-l border-[#e4e4e7] overflow-y-auto px-6 py-8 space-y-8 shrink-0 hidden lg:block">
          <div className="space-y-4">
            <h3 className="text-[12px] font-bold text-ink-400 uppercase tracking-widest">
              Ticket Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink-600">Status</span>
                <select
                  value={ticket.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  disabled={updating}
                  className={`text-[13px] font-semibold border-none rounded px-2 py-1 outline-none cursor-pointer ${STATUS_SELECT_STYLE[ticket.status]}`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink-600">Priority</span>
                <select
                  value={ticket.priority}
                  onChange={(e) => updateField("priority", e.target.value)}
                  disabled={updating}
                  className={`text-[13px] font-semibold border-none rounded px-2 py-1 outline-none cursor-pointer ${PRIORITY_SELECT_STYLE[ticket.priority]}`}
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink-600">Assigned to</span>
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={assignee.name} size={20} />
                    <span className="text-[13px] font-medium text-ink-900">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-[13px] text-ink-400">Loading...</span>
                )}
              </div>
            </div>
          </div>

          <AIInsightCard
            summary={ticket.ai_summary}
            priority={ticket.priority}
          />

          <div className="space-y-4">
            <h3 className="text-[12px] font-bold text-ink-400 uppercase tracking-widest">
              History
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-400">Created</span>
                <span className="text-ink-600">
                  {formatDate(ticket.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-400">Last Updated</span>
                <span className="text-ink-600">
                  {timeAgo(ticket.updated_at)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-400">Notes</span>
                <span className="text-ink-600">{ticket.notes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
