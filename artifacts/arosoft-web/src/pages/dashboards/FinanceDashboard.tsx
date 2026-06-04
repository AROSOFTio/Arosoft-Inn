import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createActions, createPanels, createStats, financeMenu } from "@/components/dashboard/dashboardData";

export default function FinanceDashboard() {
  return (
    <DashboardShell
      title="Finance Dashboard"
      description="Invoices, payments, receipts, and billing operations."
      allowedRoles={["FINANCE"]}
      menuItems={financeMenu}
      stats={createStats(["Open invoices", "Payments received", "Receipts issued", "Overdue invoices"])}
      actions={createActions(["Create invoice", "Record payment", "Issue receipt", "Review overdue list"])}
      panels={createPanels("Invoices", "Payments", "Receipts")}
      summaryEndpoint="/api/dashboard/finance"
    />
  );
}
