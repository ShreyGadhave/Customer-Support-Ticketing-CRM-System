"use client";

// =============================================================================
// Analytics — /analytics
// Full analytics view: stat cards + daily trend chart + status breakdown.
// =============================================================================

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ChartBar } from "@phosphor-icons/react";
import type { AnalyticsData } from "@/lib/types";
import TopBar from "@/components/TopBar";
import StatCard from "@/components/StatCard";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_COLORS = ["#3b82f6", "#f59e0b", "#10b981"];
const STATUS_LABELS = ["Open", "In Progress", "Closed"];

export default function AnalyticsPage() {
  const [data, setData]       = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  const chartData   = data?.dailyCounts.map(d => ({ date: fmtDate(d.date), count: d.count })) ?? [];
  const statusData  = data ? [
    { name: "Open",        value: data.open },
    { name: "In Progress", value: data.inProgress },
    { name: "Closed",      value: data.closed },
  ] : [];

  const resolveRate = data && data.total > 0
    ? Math.round((data.closed / data.total) * 100)
    : 0;

  return (
    <>
      <TopBar title="Analytics" hideNewTicket />

      <div className="flex-1 overflow-y-auto p-6 lg:p-7 space-y-6">
        {/* Page header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <ChartBar size={22} className="text-brand-600" weight="fill" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-ink-900">Support Analytics</h2>
            <p className="text-[13px] text-ink-400">Overview of your team&apos;s performance</p>
          </div>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e4e4e7] rounded-xl p-5 shadow-sm space-y-3">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600 text-[14px]">{error}</p>
        ) : data && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div variants={fadeInUp}><StatCard label="Total Tickets" value={data.total} /></motion.div>
            <motion.div variants={fadeInUp}><StatCard label="Open" value={data.open} valueColor="text-blue-600" subtext="Awaiting action" /></motion.div>
            <motion.div variants={fadeInUp}><StatCard label="In Progress" value={data.inProgress} valueColor="text-amber-600" subtext="Being handled" /></motion.div>
            <motion.div variants={fadeInUp}><StatCard label="Resolution Rate" value={`${resolveRate}%`} valueColor="text-emerald-600" subtext={`${data.closed} resolved`} /></motion.div>
          </motion.div>
        )}

        {/* Charts grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Daily trend */}
          <motion.div variants={fadeInUp} className="bg-white border border-[#e4e4e7] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-ink-900 mb-1">Daily Ticket Volume</h3>
            <p className="text-[12px] text-ink-400 mb-6">New tickets created per day (last 7 days)</p>
            {loading ? <div className="h-[200px] skeleton rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f1f3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }} cursor={{ stroke: "#4f46e5", strokeWidth: 1, strokeDasharray: "3 2" }} />
                  <Area type="monotone" dataKey="count" name="Tickets" stroke="#4f46e5" strokeWidth={2.5} fill="url(#aGrad)" dot={{ r: 3, fill: "#4f46e5", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Status breakdown bar chart */}
          <motion.div variants={fadeInUp} className="bg-white border border-[#e4e4e7] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-ink-900 mb-1">Status Breakdown</h3>
            <p className="text-[12px] text-ink-400 mb-6">Tickets by current status</p>
            {loading ? <div className="h-[200px] skeleton rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f1f3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }} cursor={{ fill: "#f8f9fa" }} />
                  <Bar dataKey="value" name="Tickets" radius={[6, 6, 0, 0]}>
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={STATUS_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.div>

        {/* Status breakdown legend */}
        {!loading && data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border border-[#e4e4e7] rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-[15px] font-bold text-ink-900 mb-4">Status Summary</h3>
            <div className="space-y-3">
              {statusData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-4">
                  <span className="text-[13px] font-medium text-ink-600 w-24">{item.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: data.total > 0 ? `${(item.value / data.total) * 100}%` : "0%" }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: STATUS_COLORS[i],
                      }}
                    />
                  </div>
                  <span className="text-[13px] font-bold text-ink-900 w-8 text-right">{item.value}</span>
                  <span className="text-[11px] text-ink-400 w-12 text-right">
                    {data.total > 0 ? `${Math.round((item.value / data.total) * 100)}%` : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
