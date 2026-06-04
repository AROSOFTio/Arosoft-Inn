import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { adminMenu } from "@/components/dashboard/dashboardData";

interface Project {
  id: string;
  title: string;
}

interface StaffUser {
  id: string;
  name: string;
  role: string;
}

interface Task {
  id: string;
  projectId: string;
  assignedToId: string;
  title: string;
  roleCategory: string;
  priority: string;
  status: string;
  dueDate?: string | null;
}

const roleCategories = ["FRONTEND", "BACKEND", "FULLSTACK", "UI_UX", "MARKETING", "VIDEO", "FINANCE", "SUPPORT", "COMPLIANCE", "QA"];
const statuses = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED", "BLOCKED"];

export default function AdminTasks() {
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roleCategory, setRoleCategory] = useState("FULLSTACK");
  const [priority, setPriority] = useState("Normal");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const [projectResponse, staffResponse, taskResponse] = await Promise.all([
      fetch("/api/admin/projects", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/admin/staff", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/admin/tasks", { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    if (!projectResponse.ok || !staffResponse.ok || !taskResponse.ok) throw new Error("Unable to load task board.");
    const projectData = (await projectResponse.json()) as { projects: Project[] };
    const staffData = (await staffResponse.json()) as { users: StaffUser[] };
    const taskData = (await taskResponse.json()) as { tasks: Task[] };
    setProjects(projectData.projects);
    setStaff(staffData.users);
    setTasks(taskData.tasks);
    setProjectId((current) => current || projectData.projects[0]?.id || "");
    setAssignedToId((current) => current || staffData.users[0]?.id || "");
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch("/api/admin/tasks", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, assignedToId, title, description, roleCategory, priority, status, dueDate }),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to create task.");
      return;
    }

    setNotice("Task assigned.");
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("TODO");
    await load();
  }

  return (
    <DashboardPageShell
      title="Tasks"
      description="Assign, monitor, and review staff task work."
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
      menuItems={adminMenu}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Assign Task</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue placeholder="Project" /></SelectTrigger>
                <SelectContent>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.title}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={assignedToId} onValueChange={setAssignedToId}>
                <SelectTrigger><SelectValue placeholder="Assignee" /></SelectTrigger>
                <SelectContent>{staff.map((user) => <SelectItem key={user.id} value={user.id}>{user.name} - {user.role}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" required />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Task description" className="min-h-28" required />
              <Select value={roleCategory} onValueChange={setRoleCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{roleCategories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
              <div className="grid gap-3 md:grid-cols-3">
                <Input value={priority} onChange={(event) => setPriority(event.target.value)} placeholder="Priority" />
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </div>
              <Button disabled={!projectId || !assignedToId}>Assign Task</Button>
              {notice && <p className="text-sm text-green-700">{notice}</p>}
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>All Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="block rounded-lg border border-slate-200 p-4 hover:bg-blue-50/40">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="text-sm text-slate-600">{task.roleCategory} / {task.priority}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{task.status}</span>
                </div>
              </Link>
            ))}
            {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
