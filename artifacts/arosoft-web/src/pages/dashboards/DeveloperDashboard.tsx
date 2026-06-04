import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createActions, createPanels, createStats, developerMenu } from "@/components/dashboard/dashboardData";

export default function DeveloperDashboard() {
  return (
    <DashboardShell
      title="Developer Dashboard"
      description="Assigned tasks, project files, comments, and implementation status updates."
      allowedRoles={["FRONTEND_DEVELOPER", "BACKEND_DEVELOPER", "FULLSTACK_DEVELOPER"]}
      menuItems={developerMenu}
      stats={createStats(["Assigned tasks", "Active projects", "Project files", "Unread comments"])}
      actions={createActions(["Update task status", "Open project files", "Reply to comments", "Submit progress note"])}
      panels={createPanels("Assigned tasks", "Project files", "Comments")}
      summaryEndpoint="/api/dashboard/developer"
    />
  );
}
