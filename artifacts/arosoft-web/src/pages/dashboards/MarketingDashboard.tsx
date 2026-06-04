import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createActions, createPanels, createStats, marketingMenu } from "@/components/dashboard/dashboardData";

export default function MarketingDashboard() {
  return (
    <DashboardShell
      title="Marketing Dashboard"
      description="Marketing tasks, campaigns, content plans, and brand follow-up."
      allowedRoles={["MARKETING"]}
      menuItems={marketingMenu}
      stats={createStats(["Marketing tasks", "Active campaigns", "Content plans", "Pending reviews"])}
      actions={createActions(["Create campaign", "Update content plan", "Review asset", "Schedule post"])}
      panels={createPanels("Marketing tasks", "Campaigns", "Content plans")}
    />
  );
}
