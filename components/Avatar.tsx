"use client";

// =============================================================================
// Avatar — renders initials on a deterministically-colored circle.
// No external image dependency. Color is stable for a given name (hash-based).
// =============================================================================

const PALETTE = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-cyan-500",
];

/** Simple djb2-style hash — deterministic, fast, no crypto needed */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0; // keep 32-bit unsigned
  }
  return h;
}

/** Extract up to 2 initials: "Sarah Jenkins" → "SJ", "Marcus" → "M" */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  /** Diameter in pixels. Defaults to 32 (w-8 h-8). */
  size?: number;
  className?: string;
}

export default function Avatar({ name, size = 32, className = "" }: AvatarProps) {
  const color = PALETTE[hashName(name) % PALETTE.length];
  const initials = getInitials(name);

  // Font size scales proportionally with the circle size
  const fontSize = Math.round(size * 0.38);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white font-bold select-none shrink-0 ${color} ${className}`}
      style={{ width: size, height: size, fontSize }}
      title={name}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
