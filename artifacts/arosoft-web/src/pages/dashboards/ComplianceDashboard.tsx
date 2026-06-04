import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { complianceMenu, createActions, createPanels, createStats } from "@/components/dashboard/dashboardData";

export default function ComplianceDashboard() {
  return (
    <DashboardShell
      title="Compliance Dashboard"
      description="Tax records, contracts, company documents, and audit logs."
      allowedRoles={["COMPLIANCE"]}
      menuItems={complianceMenu}
      stats={createStats(["Tax records", "Contracts", "Company documents", "Audit log items"])}
      actions={createActions(["Review tax record", "Open contract", "Upload document", "Check audit log"])}
      panels={createPanels("Tax records", "Contracts", "Company documents")}
    />
  );
}
