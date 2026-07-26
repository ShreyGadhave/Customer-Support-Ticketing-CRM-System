import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

// POST /api/auth/signout — clears the server-side session cookie.
export async function POST() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  return response;
}

