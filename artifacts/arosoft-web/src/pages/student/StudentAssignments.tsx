import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { studentMenu } from "@/components/dashboard/dashboardData";

interface TaskRow {
  task: { id: string; title: string; description: string; status: string; dueDate?: string | null };
  course: { title: string };
}

export default function StudentAssignments() {
  const [, navigate] = useLocation();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    const response = await fetch("/api/student/assignments", { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Unable to load assignments.");
    const data = (await response.json()) as { tasks: TaskRow[] };
    setTasks(data.tasks);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  async function updateStatus(taskId: string, status: string) {
    const token = getAuthToken();
    if (!token) return;
    await fetch(`/api/student/assignments/${taskId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <DashboardPageShell title="Assignments" description="Complete learning tasks assigned to your courses." allowedRoles={["STUDENT"]} menuItems={studentMenu}>
      <Card className="border-slate-200 bg-white">
        <CardHeader><CardTitle>Learning Tasks</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {error && <p className="text-sm text-red-700">{error}</p>}
          {tasks.map(({ task, course }) => (
            <div key={task.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{task.title}</p>
                  <p className="text-sm text-slate-600">{course.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{task.description}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{task.status}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => updateStatus(task.id, "IN_PROGRESS")}>In Progress</Button>
                <Button size="sm" onClick={() => updateStatus(task.id, "COMPLETED")}>Complete</Button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-sm text-slate-500">No assignments yet.</p>}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
