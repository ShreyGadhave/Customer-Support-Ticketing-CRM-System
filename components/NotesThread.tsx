"use client";

// =============================================================================
// NotesThread — list of internal notes + add-note textarea.
//
// MVP: all notes are treated as internal notes (amber background, matching the
// mockup). The public-reply distinction is a stretch goal.
//
// Calls PUT /api/tickets/[ticket_id] with { note_text } to save a note, then
// refreshes the list by calling onNoteAdded so the parent can re-fetch.
// =============================================================================

import { useState } from "react";
import type { Note } from "@/lib/types";
import Avatar from "./Avatar";
import { PaperclipHorizontal } from "@phosphor-icons/react";

interface NotesThreadProps {
  ticketId: string;       // human-readable e.g. "TKT-001"
  notes: Note[];
  /** Called after a note is successfully saved so the parent can re-fetch */
  onNoteAdded: () => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function NotesThread({
  ticketId,
  notes,
  onNoteAdded,
}: NotesThreadProps) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_text: text.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save note");
      }

      setText("");
      onNoteAdded(); // trigger parent re-fetch
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pt-8 border-t border-[#f1f1f3]">
      <h3 className="text-[16px] font-bold text-ink-900 mb-6">
        Activity &amp; Notes
      </h3>

      {/* Notes list */}
      {notes.length > 0 ? (
        <div className="space-y-6 mb-10">
          {notes.map((note) => (
            <div key={note.id} className="flex gap-4">
              {/* Use a generic "Support" avatar since we have no per-note author in MVP */}
              <Avatar name="Support" size={32} className="shrink-0" />

              {/* Amber internal-note bubble — matches mockup styling */}
              <div className="flex-1 bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold text-amber-900">
                    Internal Note
                  </span>
                  <span className="text-[11px] text-amber-700/60">
                    {formatTime(note.created_at)}
                  </span>
                </div>
                <p className="text-[14px] text-amber-800 whitespace-pre-wrap">
                  {note.note_text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[14px] text-ink-400 mb-10">
          No notes yet. Add the first one below.
        </p>
      )}

      {/* Compose box */}
      <div className="bg-white border border-[#e4e4e7] rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-brand-500/5 focus-within:border-brand-500 transition-all shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#f1f1f3] bg-[#fafafa]">
          <span className="ml-auto px-2 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 rounded">
            Internal Note
          </span>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write an internal note..."
          rows={4}
          className="w-full px-4 py-3 text-[14px] outline-none resize-none"
          onKeyDown={(e) => {
            // Cmd/Ctrl + Enter submits
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
          }}
        />

        {/* Footer */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-[#f1f1f3]">
          <button className="p-1.5 text-ink-400 hover:text-brand-600 transition-colors" type="button">
            <PaperclipHorizontal size={18} />
          </button>
          <div className="flex items-center gap-3">
            {error && (
              <span className="text-[12px] text-red-600">{error}</span>
            )}
            <button
              onClick={handleSubmit}
              disabled={saving || !text.trim()}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-[13px] font-semibold transition-all"
            >
              {saving ? "Saving…" : "Add Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
