"use client";

// =============================================================================
// Sidebar — shared nav for authenticated routes.
// Reads the logged-in user from Supabase on mount, shows their name/email.
// All four nav items are now real routes.
// =============================================================================

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChatCenteredText,
  Ticket,
  Tray,
  ChartBar,
  Users,
  CaretUpDown,
  SignOut,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import Avatar from "./Avatar";

const NAV_ITEMS = [
  { label: "All Tickets", href: "/tickets", icon: Ticket },
  { label: "My Queue",    href: "/queue",   icon: Tray   },
  { label: "Analytics",  href: "/analytics",icon: ChartBar },
  { label: "Customers",  href: "/customers",icon: Users  },
];

interface UserInfo {
  name: string;
  email: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser]             = useState<UserInfo | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // Load the logged-in user once on mount
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const name =
          (data.user.user_metadata?.full_name as string) ||
          data.user.email?.split("@")[0] ||
          "User";
        setUser({ name, email: data.user.email ?? "" });
      }
    });
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-[260px] bg-white border-r border-[#e4e4e7] flex flex-col shrink-0 hidden md:flex z-10">
      {/* Logo */}
      <div className="h-[68px] flex items-center px-6 border-b border-[#f1f1f3]">
        <Link href="/tickets" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <ChatCenteredText size={18} weight="bold" />
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-ink-900">TicketFlow</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-600 hover:bg-gray-50 hover:text-ink-900"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-600 rounded-r-md" />
              )}
              <Icon
                size={18}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "ml-[3px]" : ""}
              />
              <span className={`text-[14px] ${isActive ? "font-semibold ml-[3px]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-[#f1f1f3] space-y-1">
        {/* Sign-out button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors text-[13px]"
        >
          <SignOut size={16} />
          <span>{signingOut ? "Signing out..." : "Sign out"}</span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <Avatar name={user?.name ?? "U"} size={34} />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold truncate">{user?.name ?? "Loading..."}</div>
            <div className="text-[11px] text-ink-400 truncate">{user?.email ?? ""}</div>
          </div>
          <CaretUpDown size={14} className="text-ink-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}

