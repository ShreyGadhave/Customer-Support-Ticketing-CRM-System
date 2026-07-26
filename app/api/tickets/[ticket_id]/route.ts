import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

// Force dynamic rendering since this route uses cookies for auth
export const dynamic = 'force-dynamic';

// Route params are passed as the second argument to every handler in Next.js 14
type RouteContext = { params: { ticket_id: string } };

// =============================================================================
// GET /api/tickets/[ticket_id]
// Returns a single ticket with its notes joined, ordered by note created_at asc.
// Note: [ticket_id] in the URL is the human-readable ID e.g. "TKT-001", NOT uuid.
// =============================================================================
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { ticket_id } = params;
    const db = await getSupabaseServer();

    // Fetch the ticket row
    const { data: ticket, error: ticketErr } = await db
      .from("tickets")
      .select("*")
      .eq("ticket_id", ticket_id)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Fetch associated notes, oldest first (thread order)
    const { data: notes, error: notesErr } = await db
      .from("notes")
      .select("*")
      .eq("ticket_id", ticket.id)   // FK is the uuid, not the human-readable id
      .order("created_at", { ascending: true });

    if (notesErr) {
      console.error("[GET /api/tickets/:id] Notes error:", notesErr);
      return NextResponse.json({ error: notesErr.message }, { status: 500 });
    }

    return NextResponse.json({ ...ticket, notes: notes ?? [] });
  } catch (err) {
    console.error("[GET /api/tickets/:id] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =============================================================================
// PUT /api/tickets/[ticket_id]
// Body may contain:
//   { status?: TicketStatus, priority?: TicketPriority, note_text?: string }
//
// - Updates status/priority on the ticket (updated_at is handled by DB trigger)
// - Inserts a new note if note_text is present
// =============================================================================
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { ticket_id } = params;
    const body = await req.json();
    const { status, priority, note_text } = body;
    const db = await getSupabaseServer();

    // First resolve the uuid from the human-readable ticket_id
    const { data: ticket, error: lookupErr } = await db
      .from("tickets")
      .select("id")
      .eq("ticket_id", ticket_id)
      .single();

    if (lookupErr || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Build the update payload — only include fields that were provided
    const updates: Record<string, string> = {};
    if (status)   updates.status   = status;
    if (priority) updates.priority = priority;

    // Apply ticket updates if there's anything to update
    if (Object.keys(updates).length > 0) {
      const { error: updateErr } = await db
        .from("tickets")
        .update(updates)
        .eq("id", ticket.id);

      if (updateErr) {
        console.error("[PUT /api/tickets/:id] Update error:", updateErr);
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
    }

    // Insert note if note_text was supplied
    if (note_text?.trim()) {
      const { error: noteErr } = await db
        .from("notes")
        .insert({ ticket_id: ticket.id, note_text: note_text.trim() });

      if (noteErr) {
        console.error("[PUT /api/tickets/:id] Note insert error:", noteErr);
        return NextResponse.json({ error: noteErr.message }, { status: 500 });
      }
    }

    // Return the updated ticket with notes
    const { data: updated, error: fetchErr } = await db
      .from("tickets")
      .select("*")
      .eq("id", ticket.id)
      .single();

    const { data: notes } = await db
      .from("notes")
      .select("*")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: true });

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    return NextResponse.json({ ...updated, notes: notes ?? [] });
  } catch (err) {
    console.error("[PUT /api/tickets/:id] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
