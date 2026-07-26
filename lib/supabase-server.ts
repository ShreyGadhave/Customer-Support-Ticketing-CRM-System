// Server-only Supabase client — imports next/headers so it MUST only be used
// in API Route Handlers and Server Components, never in "use client" files.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function url()     { return process.env.NEXT_PUBLIC_SUPABASE_URL!; }
function anonKey() { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; }

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(url(), anonKey(), {
    cookies: {
      getAll()               { return cookieStore.getAll(); },
      setAll(cookiesToSet)   {
        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* called from Server Component — middleware handles refresh */ }
      },
    },
  });
}
