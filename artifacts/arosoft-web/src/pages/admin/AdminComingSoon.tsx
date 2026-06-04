import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { adminMenu } from "@/components/dashboard/dashboardData";

const titles: Record<string, string> = {
  "/admin/team": "Team",
  "/admin/invoices": "Invoices",
  "/admin/compliance": "Compliance",
  "/admin/settings": "Settings",
};

export default function AdminComingSoon() {
  const [location] = useLocation();
  const title = titles[location] || "Admin Section";

  return (
    <DashboardPageShell
      title={title}
      description="This admin module is planned and will be connected in a later sprint."
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
      menuItems={adminMenu}
    >
      <Card className="border-slate-200 bg-white">
        <CardHeader><CardTitle>Coming soon</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            This page is intentionally not static. It is reserved for the next implementation sprint, and the sidebar remains available for navigation.
          </p>
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
