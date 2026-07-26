import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import type { TicketPriority } from "@/lib/types";

// Force dynamic rendering since this route uses cookies for auth
export const dynamic = 'force-dynamic';

// =============================================================================
// POST /api/tickets — Create a new ticket + AI triage
// =============================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_email, subject, description } = body;

    // Basic validation
    if (!customer_name || !customer_email || !subject) {
      return NextResponse.json(
        { error: "customer_name, customer_email, and subject are required" },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // AI triage — call Groq with a 5-second timeout.
    // We derive priority + summary from the description. If this fails for ANY
    // reason (no key, network error, bad JSON, timeout), we fall back to
    // defaults so ticket creation is never blocked.
    // -------------------------------------------------------------------------
    let ai_summary: string | null = null;
    let priority: TicketPriority = "Medium"; // safe default

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && !groqKey.startsWith("your_") && description) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s hard timeout

        const groqRes = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "system",
                  content:
                    'You are a support triage assistant. Respond ONLY with valid JSON in this exact shape: {"priority":"Low"|"Medium"|"High"|"Urgent","summary":"one sentence summary"}. No markdown, no extra keys.',
                },
                {
                  role: "user",
                  content: `Triage this support ticket:\nSubject: ${subject}\nDescription: ${description}`,
                },
              ],
              temperature: 0.2,
              max_tokens: 120,
            }),
          }
        );

        clearTimeout(timeout);

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const raw = groqData.choices?.[0]?.message?.content ?? "";

          // Parse the JSON the model returned, stripping any accidental markdown fences
          const cleaned = raw.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned) as {
            priority: TicketPriority;
            summary: string;
          };

          // Validate priority is one of our allowed values before trusting it
          const validPriorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];
          if (validPriorities.includes(parsed.priority)) {
            priority = parsed.priority;
          }
          if (parsed.summary) {
            ai_summary = parsed.summary;
          }
        }
      } catch (aiErr) {
        // AbortError (timeout) or parse error — log and continue with defaults
        console.warn("[AI triage] failed, using defaults:", aiErr);
      }
    }

    // -------------------------------------------------------------------------
    // Insert into Supabase — ticket_id is set by the DB trigger, not here
    // -------------------------------------------------------------------------
    const db = await getSupabaseServer();
    const { data, error } = await db
      .from("tickets")
      .insert({
        customer_name,
        customer_email,
        subject,
        description: description ?? "",
        priority,
        ai_summary,
        // ticket_id intentionally omitted — trigger fills it
        // status defaults to 'Open' via column default
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/tickets] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tickets] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =============================================================================
// GET /api/tickets?status=Open&search=foo
// — status: exact match on the status column (optional)
// — search: case-insensitive LIKE across customer_name, customer_email,
//           ticket_id, and subject (optional)
// =============================================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const db = await getSupabaseServer();
    let query = db
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by status when provided and non-empty
    if (status && status !== "All") {
      query = query.eq("status", status);
    }

    // Full-text search — ilike = case-insensitive LIKE in PostgREST
    // We OR across four columns so one search term hits all relevant fields.
    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,` +
          `customer_email.ilike.%${search}%,` +
          `ticket_id.ilike.%${search}%,` +
          `subject.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("[GET /api/tickets] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("[GET /api/tickets] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

