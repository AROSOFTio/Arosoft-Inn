import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { adminMenu, adminStats, createActions, createPanels } from "@/components/dashboard/dashboardData";

export default function AdminDashboard() {
  return (
    <DashboardShell
      title="Admin Dashboard"
      description="Company management, client requests, projects, team operations, support, academy, finance, and compliance."
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
      menuItems={adminMenu}
      stats={adminStats}
      actions={createActions(["Review client requests", "Assign project tasks", "Open support inbox", "Check invoices"])}
      panels={createPanels("Client requests", "Team tasks", "Support tickets")}
      summaryEndpoint="/api/dashboard/admin"
    />
  );
}
