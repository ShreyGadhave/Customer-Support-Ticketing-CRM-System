// Re-export barrel — import from specific files for tree-shaking:
//   import { getSupabaseBrowser } from "@/lib/supabase-browser"  (client components)
//   import { getSupabaseServer }  from "@/lib/supabase-server"   (API routes)
//
// This barrel is kept for backward compatibility with existing imports.
export { getSupabaseBrowser } from "./supabase-browser";
export { getSupabaseServer  } from "./supabase-server";
