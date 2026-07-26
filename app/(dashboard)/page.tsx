// Dashboard — redirects to /tickets (the main list page)
import { redirect } from "next/navigation";

export default function DashboardIndex() {
  redirect("/tickets");
}
