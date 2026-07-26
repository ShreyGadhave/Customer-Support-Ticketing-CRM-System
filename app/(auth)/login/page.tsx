"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash, ArrowRight } from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Hard navigate so middleware re-evaluates session cookies
    router.push("/tickets");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold text-ink-900 tracking-tight">Welcome back</h1>
        <p className="text-ink-400 mt-1.5 text-[15px]">Sign in to your TicketFlow account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[13px] font-semibold text-ink-600 block">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-2.5 bg-white border border-[#e4e4e7] rounded-xl text-[14px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/8 transition-all placeholder:text-ink-300"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[13px] font-semibold text-ink-600 block">
              Password
            </label>
            <Link href="#" className="text-[12px] text-brand-600 hover:text-brand-700 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-10 bg-white border border-[#e4e4e7] rounded-xl text-[14px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/8 transition-all placeholder:text-ink-300"
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeSlash size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 text-white rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-brand-500/20"
        >
          {loading ? "Signing in..." : <>Sign in <ArrowRight size={16} weight="bold" /></>}
        </button>
      </form>

      <p className="text-center text-[14px] text-ink-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-600 font-semibold hover:text-brand-700">
          Create one free
        </Link>
      </p>
    </div>
  );
}

