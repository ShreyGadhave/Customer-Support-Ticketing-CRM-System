import Link from "next/link";
import { ChatCenteredText } from "@phosphor-icons/react/dist/ssr";

// Auth layout — full-screen split with indigo branding on the left,
// form on the right. No sidebar, no top bar.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex">
      {/* Left panel — indigo brand side, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-brand-600 flex-col justify-between p-12 shrink-0 relative overflow-hidden">
        {/* Background decoration circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/5 rounded-full" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/20">
            <ChatCenteredText size={20} weight="bold" />
          </div>
          <span className="text-white text-[18px] font-bold tracking-tight">TicketFlow</span>
        </Link>

        {/* Testimonial */}
        <div className="relative z-10 space-y-6">
          <blockquote className="text-white/90 text-[17px] leading-relaxed font-medium">
            &ldquo;TicketFlow cut our response time in half. The AI triage means the right tickets
            always reach the right person immediately.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[13px]">
              PK
            </div>
            <div>
              <p className="text-white font-semibold text-[14px]">Priya Kapoor</p>
              <p className="text-white/60 text-[13px]">Head of Support, Orion Labs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#fafafa]">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <ChatCenteredText size={17} weight="bold" />
          </div>
          <span className="text-ink-900 text-[17px] font-bold">TicketFlow</span>
        </Link>

        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
