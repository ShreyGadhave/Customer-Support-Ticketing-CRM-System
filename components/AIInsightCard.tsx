// =============================================================================
// AIInsightCard — indigo gradient card from ticket-detail.html sidebar.
// Shows the AI-generated summary and priority reasoning.
// Renders nothing when there's no summary (AI call failed or skipped).
// =============================================================================

import { Sparkle } from "@phosphor-icons/react/dist/ssr";

interface AIInsightCardProps {
  summary: string | null;
  priority: string;
}

export default function AIInsightCard({ summary, priority }: AIInsightCardProps) {
  // Don't render the card at all if there's no AI content
  if (!summary) return null;

  return (
    <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-brand-500/20 relative overflow-hidden">
      {/* Decorative blurred circle — matches the mockup's subtle glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Sparkle size={14} weight="fill" />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-wider">
            AI Insights
          </span>
        </div>

        {/* Summary text */}
        <p className="text-[13px] font-medium leading-relaxed opacity-90">
          {summary}
        </p>

        {/* Footer: suggested priority from AI */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <span className="text-[11px] font-medium opacity-70">
            Suggested priority:{" "}
            <span className="font-bold opacity-100">{priority}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
