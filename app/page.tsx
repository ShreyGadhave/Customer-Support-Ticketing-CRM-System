"use client";

// =============================================================================
// Landing Page — /
//
// Sections:
//   1. Hero — asymmetric split, indigo gradient badge, animated enter
//   2. Social proof — trusted-by strip
//   3. Features — 3-col bento grid with varied backgrounds
//   4. How it works — 3-step numbered flow
//   5. AI Triage highlight — indigo card, full-width
//   6. CTA banner — centered, gradient bg
//   7. Footer
// =============================================================================

import Link from "next/link";
import { motion } from "motion/react";
import {
  Ticket,
  Lightning,
  ChartBar,
  ChatCenteredText,
  Sparkle,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  BellRinging,
  ShieldCheck,
} from "@phosphor-icons/react";
import LandingNav from "@/components/LandingNav";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ---- Feature card data -------------------------------------------------------
const FEATURES = [
  {
    icon: Sparkle,
    title: "AI-Powered Triage",
    description: "Every ticket is automatically analyzed by Llama 3.1. Priority and summary are set before a human even opens it.",
    bg: "bg-brand-600",
    iconColor: "text-white",
    textColor: "text-white",
    descColor: "text-white/80",
    span: "lg:col-span-2",
  },
  {
    icon: Lightning,
    title: "Realtime Updates",
    description: "Ticket changes appear instantly across all open sessions via Supabase Realtime — no refresh needed.",
    bg: "bg-white border border-[#e4e4e7]",
    iconColor: "text-amber-500",
    textColor: "text-ink-900",
    descColor: "text-ink-400",
    span: "",
  },
  {
    icon: Clock,
    title: "Smart Queue",
    description: "See only what needs attention. The queue filters to open and in-progress tickets automatically.",
    bg: "bg-white border border-[#e4e4e7]",
    iconColor: "text-brand-600",
    textColor: "text-ink-900",
    descColor: "text-ink-400",
    span: "",
  },
  {
    icon: ChartBar,
    title: "Built-in Analytics",
    description: "Daily ticket volume, resolution rate, and status breakdown in one place. No third-party BI tools needed.",
    bg: "bg-white border border-[#e4e4e7]",
    iconColor: "text-emerald-500",
    textColor: "text-ink-900",
    descColor: "text-ink-400",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description: "Row-level security on every table. Auth via Supabase with email verification out of the box.",
    bg: "bg-[#f8f9fa] border border-[#e4e4e7]",
    iconColor: "text-brand-600",
    textColor: "text-ink-900",
    descColor: "text-ink-400",
    span: "lg:col-span-2",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Customer submits a request",
    desc: "Via email or your existing intake form. TicketFlow creates a structured ticket with a human-readable ID.",
  },
  {
    n: "02",
    title: "AI analyzes and triages",
    desc: "Groq runs Llama 3.1 on the description. Priority and a one-line summary are set within seconds.",
  },
  {
    n: "03",
    title: "Your team resolves it",
    desc: "Agents pick up tickets from the queue, add internal notes, update status, and close the loop.",
  },
];

const TRUSTED_BY = ["Orion Labs", "Meridian SaaS", "Vertex Health", "Caliber IO", "Prismatic"];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-white text-ink-900">
      <LandingNav />

      {/* ================================================================== */}
      {/* 1. HERO                                                             */}
      {/* ================================================================== */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle radial glow behind hero content */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
          {/* Left: copy */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-full">
              <Sparkle size={13} weight="fill" className="text-brand-600" />
              <span className="text-[12px] font-semibold text-brand-700">AI triage with Llama 3.1</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-[44px] md:text-[56px] font-bold leading-[1.05] tracking-tight">
              Support tickets,<br />
              <span className="text-brand-600">handled fast.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-[17px] text-ink-400 leading-relaxed max-w-[460px]">
              TicketFlow gives your team a clean queue, instant AI priority scoring,
              and realtime updates — so nothing falls through the cracks.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white rounded-xl text-[15px] font-semibold transition-all shadow-xl shadow-brand-500/20"
              >
                Get started free <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-[#e4e4e7] hover:bg-gray-50 text-ink-600 rounded-xl text-[15px] font-semibold transition-all"
              >
                Sign in
              </Link>
            </motion.div>

            {/* Trust bullets */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-x-6 gap-y-2">
              {["Free to start", "No credit card", "Set up in minutes"].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-[13px] text-ink-400">
                  <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                  {t}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="bg-white rounded-2xl border border-[#e4e4e7] shadow-2xl shadow-gray-200/60 overflow-hidden">
              {/* Mock TopBar */}
              <div className="h-[52px] bg-[#fafafa] border-b border-[#f1f1f3] flex items-center justify-between px-5">
                <span className="text-[13px] font-semibold text-ink-900">Support Overview</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-6 rounded-lg bg-gray-100" />
                  <div className="w-20 h-7 rounded-lg bg-brand-600" />
                </div>
              </div>

              {/* Mock stat cards */}
              <div className="grid grid-cols-4 gap-3 p-4">
                {[
                  { label: "Total", value: "124", color: "text-ink-900" },
                  { label: "Open", value: "38", color: "text-blue-600" },
                  { label: "In Progress", value: "22", color: "text-amber-600" },
                  { label: "Closed", value: "64", color: "text-emerald-600" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-[#e4e4e7] p-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-ink-400">{s.label}</p>
                    <p className={`text-[22px] font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Mock ticket rows */}
              <div className="px-4 pb-4 space-y-2">
                {[
                  { id: "TKT-124", name: "Priya Kapoor",  subj: "Login loop after password reset", priority: "Urgent", status: "Open" },
                  { id: "TKT-123", name: "Marco Delgado", subj: "Invoice not generating PDF",        priority: "High",   status: "In Progress" },
                  { id: "TKT-122", name: "Yuki Tanaka",   subj: "API rate limit exceeded",           priority: "Medium", status: "Open" },
                ].map(row => (
                  <div key={row.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#fafafa] border border-[#f1f1f3]">
                    <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[9px] font-bold shrink-0">
                      {row.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-ink-400">{row.id}</p>
                      <p className="text-[11px] font-medium text-ink-900 truncate">{row.subj}</p>
                    </div>
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      row.priority === "Urgent" ? "bg-red-50 text-red-700" :
                      row.priority === "High"   ? "bg-orange-50 text-orange-600" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>{row.priority}</div>
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      row.status === "Open" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                    }`}>{row.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating AI badge */}
            <div className="absolute -top-4 -right-4 bg-brand-600 text-white rounded-2xl px-4 py-3 shadow-xl shadow-brand-500/30 flex items-center gap-2.5 border border-brand-700/20">
              <Sparkle size={16} weight="fill" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">AI Priority</p>
                <p className="text-[13px] font-bold">Urgent - Login Issue</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. TRUSTED BY                                                       */}
      {/* ================================================================== */}
      <section className="py-12 border-y border-[#f1f1f3] bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[12px] font-bold uppercase tracking-widest text-ink-400 mb-8">
            Trusted by support teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {TRUSTED_BY.map(name => (
              <span key={name} className="text-[15px] font-bold text-ink-300 hover:text-ink-400 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. FEATURES BENTO GRID                                              */}
      {/* ================================================================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-[36px] md:text-[44px] font-bold tracking-tight">Everything your team needs</motion.h2>
            <motion.p variants={fadeInUp} className="text-[17px] text-ink-400 mt-4 max-w-xl mx-auto">
              From intake to resolution, TicketFlow covers the full support workflow in one focused tool.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeInUp} className={`rounded-2xl p-7 ${f.bg} ${f.span}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${
                    f.bg.includes("brand-600") ? "bg-white/20" : "bg-brand-50"
                  }`}>
                    <Icon size={22} weight="fill" className={f.iconColor} />
                  </div>
                  <h3 className={`text-[17px] font-bold mb-2 ${f.textColor}`}>{f.title}</h3>
                  <p className={`text-[14px] leading-relaxed ${f.descColor}`}>{f.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. HOW IT WORKS                                                     */}
      {/* ================================================================== */}
      <section className="py-24 px-6 bg-[#fafafa] border-y border-[#f1f1f3]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-[36px] md:text-[44px] font-bold tracking-tight">How it works</motion.h2>
            <motion.p variants={fadeInUp} className="text-[17px] text-ink-400 mt-4 max-w-md mx-auto">Three steps from request to resolution.</motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {STEPS.map((step, i) => (
              <motion.div key={step.n} variants={fadeInUp} className="relative">
                {/* Connector line — between steps on desktop */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(100%-8px)] w-full h-[2px] bg-[#e4e4e7]" style={{ width: "calc(100% - 48px)", left: "calc(50% + 24px)" }} />
                )}
                <div className="text-[11px] font-bold text-brand-600 mb-4 font-mono">{step.n}</div>
                <h3 className="text-[18px] font-bold text-ink-900 mb-2">{step.title}</h3>
                <p className="text-[14px] text-ink-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. AI TRIAGE HIGHLIGHT                                              */}
      {/* ================================================================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-brand-600 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden relative"
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-8 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 border border-white/20 rounded-full">
                  <Sparkle size={13} weight="fill" className="text-white" />
                  <span className="text-[12px] font-semibold text-white">Powered by Groq + Llama 3.1</span>
                </div>
                <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight tracking-tight">
                  AI that triages before you even open the ticket
                </h2>
                <p className="text-[16px] text-white/75 leading-relaxed max-w-[420px]">
                  Describe the problem and TicketFlow automatically sets the priority (Urgent / High / Medium / Low)
                  and writes a one-line summary. Your team sees the critical tickets first, every time.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 rounded-xl text-[14px] font-semibold hover:bg-brand-50 active:scale-[0.98] transition-all"
                >
                  Try it free <ArrowRight size={15} weight="bold" />
                </Link>
              </div>

              {/* Right: mock AI card */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkle size={13} weight="fill" className="text-white" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">AI Insight</span>
                </div>
                <p className="text-[14px] text-white/90 leading-relaxed">
                  User is experiencing an authentication loop likely caused by a cached session token conflict after
                  password reset. Needs immediate intervention to prevent account lockout.
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-red-400/20 text-red-200 text-[11px] font-bold rounded">URGENT</div>
                  <span className="text-[11px] text-white/50">Suggested priority</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. FINAL CTA                                                        */}
      {/* ================================================================== */}
      <section className="py-24 px-6 border-t border-[#f1f1f3]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <motion.div variants={fadeInUp} className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto">
            <BellRinging size={28} weight="fill" />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-[36px] md:text-[44px] font-bold tracking-tight">
            Start resolving tickets faster
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[17px] text-ink-400 leading-relaxed">
            Set up your TicketFlow workspace in minutes. No credit card required,
            no complex onboarding.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white rounded-xl text-[15px] font-semibold transition-all shadow-xl shadow-brand-500/20"
            >
              Create free account <ArrowRight size={16} weight="bold" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================== */}
      {/* 7. FOOTER                                                           */}
      {/* ================================================================== */}
      <footer className="border-t border-[#f1f1f3] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <ChatCenteredText size={14} weight="bold" />
            </div>
            <span className="text-[15px] font-bold text-ink-900">TicketFlow</span>
          </div>
          <p className="text-[13px] text-ink-400">
            Built with Next.js, Supabase, and Groq.
          </p>
          <div className="flex gap-6">
            <Link href="/login"  className="text-[13px] text-ink-400 hover:text-ink-600 transition-colors">Sign in</Link>
            <Link href="/signup" className="text-[13px] text-ink-400 hover:text-ink-600 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
