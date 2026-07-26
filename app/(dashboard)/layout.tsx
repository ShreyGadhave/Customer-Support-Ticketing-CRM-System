import Sidebar from "@/components/Sidebar";

// Dashboard layout — wraps all authenticated app routes.
// Sidebar renders here so it persists across /tickets, /queue, /analytics,
// /customers without unmounting between client-side navigations.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f8f9fa] text-ink-900 h-[100dvh] w-full flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
