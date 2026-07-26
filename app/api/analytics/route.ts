import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

// =============================================================================
// GET /api/analytics
// Returns aggregate ticket stats + daily counts for the last 7 days.
//
// Response shape:
// {
//   total: number,
//   open: number,
//   inProgress: number,
//   closed: number,
//   dailyCounts: { date: string, count: number }[]  // "YYYY-MM-DD", newest last
// }
// =============================================================================
export async function GET() {
  try {
    // -------------------------------------------------------------------------
    // Fetch all tickets — we only need status + created_at.
    // For an MVP with hundreds of tickets this is fine; swap to Postgres
    // aggregate functions (count(*) group by) when the dataset grows.
    // -------------------------------------------------------------------------
    const db = await getSupabaseServer();
    const { data: tickets, error } = await db
      .from("tickets")
      .select("status, created_at");

    if (error) {
      console.error("[GET /api/analytics] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = tickets ?? [];

    // Status totals
    const total      = rows.length;
    const open       = rows.filter((t) => t.status === "Open").length;
    const inProgress = rows.filter((t) => t.status === "In Progress").length;
    const closed     = rows.filter((t) => t.status === "Closed").length;

    // -------------------------------------------------------------------------
    // Daily counts for the last 7 days
    //
    // Build a map keyed by "YYYY-MM-DD", defaulting every day to 0 so days
    // with no tickets still appear in the chart (flat line, not a gap).
    // -------------------------------------------------------------------------
    const today = new Date();
    const dailyMap: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
      dailyMap[key] = 0;
    }

    // Increment each day's counter for tickets created in that window
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    for (const ticket of rows) {
      const date = new Date(ticket.created_at);
      if (date >= sevenDaysAgo) {
        const key = date.toISOString().slice(0, 10);
        if (key in dailyMap) {
          dailyMap[key]++;
        }
      }
    }

    const dailyCounts = Object.entries(dailyMap).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ total, open, inProgress, closed, dailyCounts });
  } catch (err) {
    console.error("[GET /api/analytics] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

