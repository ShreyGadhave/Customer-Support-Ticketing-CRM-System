"use client";

// =============================================================================
// Customers — /customers
// Lists unique customers derived from tickets, with their ticket counts and
// most recent activity. Click a customer row to filter the tickets list.
// =============================================================================

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Users, MagnifyingGlass } from "@phosphor-icons/react";
import type { Ticket } from "@/lib/types";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import TopBar from "@/components/TopBar";

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
      staggerChildren: 0.05,
    },
  },
};

interface Customer {
  name: string;
  email: string;
  total: number;
  open: number;
  lastSeen: string;
  latestStatus: Ticket["status"];
}

function buildCustomers(tickets: Ticket[]): Customer[] {
  const map = new Map<string, Customer>();

  for (const t of tickets) {
    const key = t.customer_email.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        name: t.customer_name,
        email: t.customer_email,
        total: 0,
        open: 0,
        lastSeen: t.created_at,
        latestStatus: t.status,
      });
    }
    const c = map.get(key)!;
    c.total++;
    if (t.status !== "Closed") c.open++;
    if (new Date(t.created_at) > new Date(c.lastSeen)) {
      c.lastSeen = t.created_at;
      c.latestStatus = t.status;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CustomersPage() {
  const router             = useRouter();
  const [tickets, setTickets]  = useState<Ticket[]>([]);
  const [loading, setLoading]  = useState(true);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    fetch("/api/tickets")
      .then(r => r.json())
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  const customers = useMemo(() => buildCustomers(tickets), [tickets]);

  const filtered = useMemo(() =>
    localSearch
      ? customers.filter(c =>
          c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          c.email.toLowerCase().includes(localSearch.toLowerCase())
        )
      : customers,
    [customers, localSearch]
  );

  return (
    <>
      <TopBar title="Customers" hideNewTicket />

      <div className="flex-1 overflow-y-auto p-6 lg:p-7 space-y-6">
        {/* Page header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Users size={22} className="text-brand-600" weight="fill" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-ink-900">Customers</h2>
              <p className="text-[13px] text-ink-400">
                {loading ? "Loading..." : `${customers.length} unique customer${customers.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Local search */}
          <div className="relative w-64">
            <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#e4e4e7] rounded-xl text-[13px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-[#e4e4e7] rounded-2xl overflow-hidden shadow-sm"
        >
          {loading ? (
            <div className="divide-y divide-[#f1f1f3]">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="skeleton w-9 h-9 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="skeleton h-4 w-36 rounded" />
                    <div className="skeleton h-3 w-48 rounded" />
                  </div>
                  <div className="skeleton h-4 w-16 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-ink-300" />
              </div>
              <p className="text-[16px] font-bold text-ink-900">No customers yet</p>
              <p className="text-[14px] text-ink-400 mt-1">Customers will appear here once tickets are created.</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="text-[11px] font-bold text-ink-400 uppercase tracking-widest bg-[#fcfcfd] border-b border-[#f1f1f3]">
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-4">Email</th>
                      <th className="py-4 px-4 text-center">Total Tickets</th>
                      <th className="py-4 px-4 text-center">Open</th>
                      <th className="py-4 px-6 text-right">Last Activity</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="divide-y divide-[#f1f1f3] text-[14px]"
                  >
                    {filtered.map((c, i) => (
                      <motion.tr
                        key={c.email}
                        variants={fadeInUp}
                        onClick={() => router.push(`/tickets?search=${encodeURIComponent(c.email)}`)}
                        className={`hover:bg-[#fafafa] transition-colors cursor-pointer ${i % 2 !== 0 ? "bg-[#fcfcfd]/30" : ""}`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar name={c.name} size={32} />
                            <span className="font-semibold text-ink-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-ink-400 text-[13px]">{c.email}</td>
                        <td className="py-4 px-4 text-center font-bold text-ink-900">{c.total}</td>
                        <td className="py-4 px-4 text-center">
                          {c.open > 0
                            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{c.open} open</span>
                            : <span className="text-ink-300 text-[12px]">-</span>
                          }
                        </td>
                        <td className="py-4 px-6 text-right text-ink-400 text-[13px]">{formatDate(c.lastSeen)}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="md:hidden divide-y divide-[#f1f1f3]"
              >
                {filtered.map(c => (
                  <motion.div
                    key={c.email}
                    variants={fadeInUp}
                    onClick={() => router.push(`/tickets?search=${encodeURIComponent(c.email)}`)}
                    className="p-4 hover:bg-[#fafafa] cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar name={c.name} size={36} />
                      <div>
                        <p className="text-[14px] font-semibold text-ink-900">{c.name}</p>
                        <p className="text-[12px] text-ink-400">{c.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-[12px] text-ink-400">{c.total} ticket{c.total !== 1 ? "s" : ""}</span>
                      {c.open > 0 && <StatusBadge status="Open" />}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-6 py-4 bg-[#fcfcfd] border-t border-[#f1f1f3]">
              <p className="text-[13px] text-ink-400">
                {filtered.length} of {customers.length} customer{customers.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
