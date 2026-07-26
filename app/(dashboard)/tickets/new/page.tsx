"use client";

// Create Ticket — /tickets/new
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkle } from "@phosphor-icons/react";

interface FormState {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
}
const EMPTY: FormState = { customer_name: "", customer_email: "", subject: "", description: "" };

export default function NewTicketPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  function validate() {
    const next: Partial<FormState> = {};
    if (!form.customer_name.trim()) next.customer_name = "Required";
    if (!form.customer_email.trim()) next.customer_email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) next.customer_email = "Invalid email";
    if (!form.subject.trim()) next.subject = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res  = await fetch("/api/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create ticket");
      router.push(`/tickets/${data.ticket_id}`);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const inputCls = (hasErr: boolean) =>
    `w-full px-4 py-2.5 bg-white border ${hasErr ? "border-red-400" : "border-[#e4e4e7] focus:border-brand-500"} focus:ring-4 focus:ring-brand-500/5 rounded-xl text-[14px] outline-none transition-all placeholder:text-ink-300`;

  return (
    <>
      <header className="h-[68px] bg-white border-b border-[#e4e4e7] flex items-center justify-between px-7 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/tickets" className="p-2 -ml-2 text-ink-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[17px] font-semibold">Create Ticket</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/tickets" className="px-4 py-2 text-ink-600 hover:bg-gray-100 rounded-lg text-[13px] font-medium transition-colors">Cancel</Link>
          <button form="create-ticket-form" type="submit" disabled={submitting}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-lg text-[13px] font-medium transition-colors shadow-sm">
            {submitting ? "Saving..." : "Save Ticket"}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-[#fdfdfe]">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <div>
            <h2 className="text-[20px] font-bold text-ink-900">New Support Request</h2>
            <p className="text-[14px] text-ink-400 mt-1">Fill in the details to open a new support ticket on behalf of a customer.</p>
          </div>

          <form id="create-ticket-form" onSubmit={handleSubmit} noValidate className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="customer_name" className="text-[13px] font-semibold text-ink-600 block">Customer Name</label>
                <input id="customer_name" type="text" value={form.customer_name} onChange={set("customer_name")} placeholder="e.g. Alex Rivera" className={inputCls(!!errors.customer_name)} />
                {errors.customer_name && <p className="text-[12px] text-red-600">{errors.customer_name}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="customer_email" className="text-[13px] font-semibold text-ink-600 block">Customer Email</label>
                <input id="customer_email" type="email" value={form.customer_email} onChange={set("customer_email")} placeholder="alex@example.com" className={inputCls(!!errors.customer_email)} />
                {errors.customer_email && <p className="text-[12px] text-red-600">{errors.customer_email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-[13px] font-semibold text-ink-600 block">Subject</label>
              <input id="subject" type="text" value={form.subject} onChange={set("subject")} placeholder="What is the issue about?" className={inputCls(!!errors.subject)} />
              {errors.subject && <p className="text-[12px] text-red-600">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-[13px] font-semibold text-ink-600 block">Description</label>
              <textarea id="description" rows={8} value={form.description} onChange={set("description")} placeholder="Detailed description of the customer's problem..."
                className="w-full px-4 py-3 bg-white border border-[#e4e4e7] focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 rounded-xl text-[14px] outline-none transition-all placeholder:text-ink-300 resize-none" />
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                <div className="w-5 h-5 rounded bg-brand-600 flex items-center justify-center text-white shrink-0">
                  <Sparkle size={11} weight="fill" />
                </div>
                <p className="text-[11px] text-brand-700 font-medium">AI will auto-suggest priority and summary based on your description.</p>
              </div>
            </div>

            {serverError && <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{serverError}</p>}

            <div className="pt-4 border-t border-[#f1f1f3] flex justify-end">
              <button type="submit" disabled={submitting}
                className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-brand-500/20 active:scale-95">
                {submitting ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
