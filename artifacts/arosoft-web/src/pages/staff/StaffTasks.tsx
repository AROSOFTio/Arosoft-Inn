import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { complianceMenu, developerMenu, financeMenu, marketingMenu, supportMenu, videoMenu } from "@/components/dashboard/dashboardData";

interface Task {
  id: string;
  title: string;
  description: string;
  roleCategory: string;
  priority: string;
  status: string;
  dueDate?: string | null;
}

export default function StaffTasks() {
  const [location, navigate] = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/staff/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load assigned tasks.");
        return response.json() as Promise<{ tasks: Task[] }>;
      })
      .then((data) => setTasks(data.tasks))
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  const menuItems = location.startsWith("/support")
    ? supportMenu
    : location.startsWith("/marketing")
      ? marketingMenu
      : location.startsWith("/video")
        ? videoMenu
        : location.startsWith("/finance")
          ? financeMenu
          : location.startsWith("/compliance")
            ? complianceMenu
            : developerMenu;

  return (
    <DashboardPageShell
      title="Assigned Tasks"
      description="View and open tasks assigned to your staff account."
      allowedRoles={["SUPPORT", "FRONTEND_DEVELOPER", "BACKEND_DEVELOPER", "FULLSTACK_DEVELOPER", "MARKETING", "VIDEO_EDITOR", "FINANCE", "COMPLIANCE"]}
      menuItems={menuItems}
    >
      <div className="max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Staff</p>
            <h1 className="text-2xl font-bold text-slate-950">Assigned Tasks</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
        </header>
        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>My Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="block rounded-lg border border-slate-200 p-4 hover:bg-blue-50/40">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                    <p className="mt-2 text-xs text-slate-500">{task.roleCategory} / {task.priority} / {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{task.status}</span>
                </div>
              </Link>
            ))}
            {tasks.length === 0 && <p className="text-sm text-slate-500">No assigned tasks yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
