// StatCard — dashboard summary tile.
// Matches the mockup: uppercase label, large value, optional trend badge or subtext.

import { TrendUp } from "@phosphor-icons/react/dist/ssr";

interface StatCardProps {
  label: string;
  value: number | string;
  /** e.g. "+6.2%" — renders as green trend badge */
  trend?: string;
  /** e.g. "Needs attention" — renders as muted subtext */
  subtext?: string;
  /** Tailwind text color class for the value, e.g. "text-blue-600" */
  valueColor?: string;
}

export default function StatCard({
  label,
  value,
  trend,
  subtext,
  valueColor = "text-ink-900",
}: StatCardProps) {
  return (
    <div className="bg-white border border-[#e4e4e7] rounded-xl p-5 shadow-sm">
      <p className="text-[12px] font-bold text-ink-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-end justify-between mt-1">
        <span className={`text-[28px] font-bold ${valueColor}`}>{value}</span>

        {/* Trend badge — green with up arrow */}
        {trend && (
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
            <TrendUp size={12} weight="bold" />
            {trend}
          </span>
        )}

        {/* Plain subtext for cards without a trend */}
        {subtext && !trend && (
          <span className="text-[11px] font-medium text-ink-400">{subtext}</span>
        )}
      </div>
    </div>
  );
}
