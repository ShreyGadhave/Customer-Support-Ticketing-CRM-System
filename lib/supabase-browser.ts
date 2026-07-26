// Browser-only Supabase client — safe to import in "use client" components.
// Does NOT import next/headers, so it works in client components and pages.
import { createBrowserClient } from "@supabase/ssr";

function url()     { return process.env.NEXT_PUBLIC_SUPABASE_URL!; }
function anonKey() { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; }

export function getSupabaseBrowser() {
  return createBrowserClient(url(), anonKey());
}
