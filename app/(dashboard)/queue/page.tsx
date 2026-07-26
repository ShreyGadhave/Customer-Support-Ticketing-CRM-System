"use client";

// =============================================================================
// My Queue — /queue
// Shows tickets that are Open or In Progress (the "needs attention" view).
// In a real multi-user setup, this would filter by assigned_to = current user.
// For MVP it shows all non-closed tickets so the page is functional + useful.
// =============================================================================

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Tray } from "@phosphor-icons/react";
import type { Ticket } from "@/lib/types";
import TopBar from "@/components/TopBar";
import TicketTable from "@/components/TicketTable";
import TicketCard from "@/components/TicketCard";
import TableSkeleton from "@/components/TableSkeleton";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function QueuePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const fetchQueue = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      // Queue shows open + in-progress tickets; we fetch both and merge client-side
      // (the API only supports one status filter at a time)
      const [openRes, ipRes] = await Promise.all([
        fetch(`/api/tickets?status=Open${s ? `&search=${encodeURIComponent(s)}` : ""}`),
        fetch(`/api/tickets?status=In Progress${s ? `&search=${encodeURIComponent(s)}` : ""}`),
      ]);
      const open = openRes.ok ? await openRes.json() : [];
      const ip   = ipRes.ok  ? await ipRes.json()  : [];

      // Merge and sort by created_at desc
      const merged = [...open, ...ip].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTickets(merged);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQueue(""); }, [fetchQueue]);
  useEffect(() => { fetchQueue(search); }, [search, fetchQueue]);

  return (
    <>
      <TopBar title="My Queue" onSearch={setSearch} searchValue={search} />

      <div className="flex-1 overflow-y-auto p-6 lg:p-7 space-y-6">
        {/* Queue summary banner */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Tray size={22} className="text-amber-600" weight="fill" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-amber-900">
              {loading ? "..." : `${tickets.length} ticket${tickets.length !== 1 ? "s" : ""} need attention`}
            </p>
            <p className="text-[13px] text-amber-700 mt-0.5">
              Showing all Open and In Progress tickets
            </p>
          </div>
        </motion.div>

        {/* Ticket list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-[#e4e4e7] rounded-2xl overflow-hidden shadow-sm"
        >
          {loading ? (
            <TableSkeleton />
          ) : tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Tray size={32} weight="fill" className="text-emerald-500" />
              </div>
              <p className="text-[16px] font-bold text-ink-900">Queue is clear</p>
              <p className="text-[14px] text-ink-400 mt-1">No open or in-progress tickets right now.</p>
            </motion.div>
          ) : (
            <>
              <TicketTable tickets={tickets} />
              <TicketCard  tickets={tickets} />
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
