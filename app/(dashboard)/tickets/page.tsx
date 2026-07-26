"use client";

// =============================================================================
// All Tickets — /tickets
// Fetches stats + chart data + ticket list. Realtime subscription keeps live.
// =============================================================================

import { useCallback, useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Funnel, Export } from "@phosphor-icons/react";

import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { AnalyticsData, Ticket, TicketStatus } from "@/lib/types";

import TopBar from "@/components/TopBar";
import StatCard from "@/components/StatCard";
import FilterChips from "@/components/FilterChips";
import TicketTable from "@/components/TicketTable";
import TicketCard from "@/components/TicketCard";
import EmptyState from "@/components/EmptyState";
import TableSkeleton from "@/components/TableSkeleton";

type FilterValue = "All" | TicketStatus;

function formatChartDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TicketsPage() {
  const [analytics, setAnalytics]           = useState<AnalyticsData | null>(null);
  const [tickets, setTickets]               = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [filter, setFilter]                 = useState<FilterValue>("All");
  const [search, setSearch]                 = useState("");
  const [error, setError]                   = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error();
      setAnalytics(await res.json());
    } catch { /* silent */ }
    finally { setLoadingAnalytics(false); }
  }, []);

  const fetchTickets = useCallback(async (f: FilterValue, s: string) => {
    setLoadingTickets(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      if (f !== "All") p.set("status", f);
      if (s) p.set("search", s);
      const res = await fetch(`/api/tickets?${p}`);
      if (!res.ok) throw new Error();
      setTickets(await res.json());
    } catch { setError("Failed to load tickets. Please refresh."); }
    finally { setLoadingTickets(false); }
  }, []);

  useEffect(() => { fetchAnalytics(); fetchTickets("All", ""); }, [fetchAnalytics, fetchTickets]);
  useEffect(() => { fetchTickets(filter, search); }, [filter, search, fetchTickets]);

  // Realtime subscription — refreshes both data sets on any ticket change
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const channel  = supabase
      .channel("tickets-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, () => {
        fetchTickets(filter, search);
        fetchAnalytics();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [filter, search, fetchTickets, fetchAnalytics]);

  const chartData = analytics?.dailyCounts.map(d => ({ date: formatChartDate(d.date), count: d.count })) ?? [];

  return (
    <>
      <TopBar title="Support Overview" onSearch={setSearch} searchValue={search} />

      <div className="flex-1 overflow-y-auto p-6 lg:p-7 space-y-6">
        {/* Stats */}
        {loadingAnalytics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e4e4e7] rounded-xl p-5 shadow-sm space-y-3">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Tickets" value={analytics.total} subtext={analytics.total === 0 ? "No tickets yet" : undefined} />
            <StatCard label="Open"        value={analytics.open}        subtext="Needs attention" valueColor="text-blue-600" />
            <StatCard label="In Progress" value={analytics.inProgress}  subtext="Assigned"        valueColor="text-amber-600" />
            <StatCard label="Closed"      value={analytics.closed}      subtext="Resolved"         valueColor="text-emerald-600" />
          </div>
        )}

        {/* Chart */}
        <div className="bg-white border border-[#e4e4e7] rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-[16px] font-bold text-ink-900">Tickets Created per Day</h2>
            <p className="text-[13px] text-ink-400 mt-0.5">Last 7 days activity</p>
          </div>
          {loadingAnalytics ? <div className="h-[220px] skeleton rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="indigoFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f1f3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} cursor={{ stroke: "#4f46e5", strokeWidth: 1, strokeDasharray: "4 2" }} />
                <Area type="monotone" dataKey="count" name="Tickets" stroke="#4f46e5" strokeWidth={2.5} fill="url(#indigoFill)" dot={{ r: 3, fill: "#4f46e5", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#4f46e5", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Ticket list */}
        <div className="bg-white border border-[#e4e4e7] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f1f3]">
            <FilterChips selected={filter} onChange={setFilter} />
            <div className="flex items-center gap-3">
              <button className="p-2 text-ink-400 hover:bg-gray-100 rounded-lg"><Funnel size={20} /></button>
              <button className="p-2 text-ink-400 hover:bg-gray-100 rounded-lg"><Export size={20} /></button>
            </div>
          </div>

          {error ? (
            <div className="px-6 py-12 text-center text-red-600 text-[14px]">{error}</div>
          ) : loadingTickets ? (
            <TableSkeleton />
          ) : tickets.length === 0 ? (
            <div className="p-6"><EmptyState /></div>
          ) : (
            <>
              <TicketTable tickets={tickets} />
              <TicketCard  tickets={tickets} />
            </>
          )}

          {!loadingTickets && tickets.length > 0 && (
            <div className="px-6 py-4 bg-[#fcfcfd] border-t border-[#f1f1f3]">
              <p className="text-[13px] text-ink-400">Showing {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

