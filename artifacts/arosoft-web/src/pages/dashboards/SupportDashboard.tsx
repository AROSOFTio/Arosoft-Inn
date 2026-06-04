import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createActions, createPanels, createStats, supportMenu } from "@/components/dashboard/dashboardData";

export default function SupportDashboard() {
  return (
    <DashboardShell
      title="Support Dashboard"
      description="Inbox, tickets, client replies, and service follow-up."
      allowedRoles={["SUPPORT"]}
      menuItems={supportMenu}
      stats={createStats(["Inbox messages", "Open tickets", "Pending replies", "Resolved today"])}
      actions={createActions(["Open inbox", "Assign ticket", "Send reply", "Close resolved item"])}
      panels={createPanels("Inbox", "Tickets", "Replies")}
    />
  );
}
