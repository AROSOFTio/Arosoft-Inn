import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { clientMenu, createActions, createPanels, createStats } from "@/components/dashboard/dashboardData";

export default function ClientDashboard() {
  return (
    <DashboardShell
      title="Client Dashboard"
      description="Requests, projects, invoices, and client support in one workspace."
      allowedRoles={["CLIENT"]}
      menuItems={clientMenu}
      stats={createStats(["Open requests", "Active projects", "Pending invoices", "Support threads"])}
      actions={createActions(["Create request", "View project", "Open invoice", "Contact support"])}
      panels={createPanels("Requests", "Projects", "Support")}
    />
  );
}
