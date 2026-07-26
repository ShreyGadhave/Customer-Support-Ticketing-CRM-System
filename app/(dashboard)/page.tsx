"use client";

// Dashboard — redirects to /tickets (the main list page)
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardIndex() {
  const router = useRouter();
  useEffect(() => { router.replace("/tickets"); }, [router]);
  return null;
}
