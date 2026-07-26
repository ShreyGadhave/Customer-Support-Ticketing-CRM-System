"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [done, setDone]           = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowser();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // After email confirmation, Supabase redirects here:
        emailRedirectTo: `${window.location.origin}/tickets`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle size={36} weight="fill" className="text-emerald-500" />
        </div>
        <h2 className="text-[22px] font-bold text-ink-900">Check your email</h2>
        <p className="text-ink-400 text-[14px] leading-relaxed max-w-[300px] mx-auto">
          We sent a confirmation link to <strong className="text-ink-600">{email}</strong>.
          Click it to activate your account and start using TicketFlow.
        </p>
        <Link href="/login" className="inline-block mt-4 text-brand-600 font-semibold text-[14px] hover:text-brand-700">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold text-ink-900 tracking-tight">Create your account</h1>
        <p className="text-ink-400 mt-1.5 text-[15px]">Free to get started, no credit card needed</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-[13px] font-semibold text-ink-600 block">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Alex Rivera"
            className="w-full px-4 py-2.5 bg-white border border-[#e4e4e7] rounded-xl text-[14px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/8 transition-all placeholder:text-ink-300"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[13px] font-semibold text-ink-600 block">
            Work email
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
          <label htmlFor="password" className="text-[13px] font-semibold text-ink-600 block">
            Password
            <span className="font-normal text-ink-400 ml-1">(min. 8 characters)</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-10 bg-white border border-[#e4e4e7] rounded-xl text-[14px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/8 transition-all placeholder:text-ink-300"
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
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
          {loading ? "Creating account..." : <>Get started free <ArrowRight size={16} weight="bold" /></>}
        </button>

        <p className="text-center text-[12px] text-ink-400 leading-relaxed">
          By signing up you agree to our{" "}
          <Link href="#" className="underline hover:text-ink-600">Terms of Service</Link>
          {" "}and{" "}
          <Link href="#" className="underline hover:text-ink-600">Privacy Policy</Link>.
        </p>
      </form>

      <p className="text-center text-[14px] text-ink-400">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}

