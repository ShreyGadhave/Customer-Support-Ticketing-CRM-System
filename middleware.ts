import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ---------------------------------------------------------------------------
// Middleware — runs on every matched request.
// Refreshes the session cookie and protects authenticated routes.
// ---------------------------------------------------------------------------

function url()     { return process.env.NEXT_PUBLIC_SUPABASE_URL!; }
function anonKey() { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; }

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // createServerClient in middleware uses request/response cookies directly
  const supabase = createServerClient(url(), anonKey(), {
    cookies: {
      getAll()             { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() also refreshes the session token if it's about to expire.
  // IMPORTANT: Do not add logic between createServerClient and getUser().
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes — redirect to /login if not authenticated
  const isProtected =
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/queue") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/customers");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Logged-in users visiting /login or /signup → send to app
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/tickets";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/).*)",
  ],
};
