import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { developerMenu } from "@/components/dashboard/dashboardData";

interface Task {
  id: string;
  title: string;
  description: string;
  roleCategory: string;
  priority: string;
  status: string;
  dueDate?: string | null;
}

interface Project {
  id: string;
  title: string;
  status: string;
}

interface TaskComment {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

const statuses = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED", "BLOCKED"];

export default function TaskDetail() {
  const [, params] = useRoute("/tasks/:id");
  const [, navigate] = useLocation();
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token || !params?.id) {
      navigate("/login");
      return;
    }

    const response = await fetch(`/api/tasks/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load task.");
    const data = (await response.json()) as { task: Task; project: Project; comments: TaskComment[] };
    setTask(data.task);
    setProject(data.project);
    setComments(data.comments);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, [params?.id]);

  async function updateStatus(status: string) {
    const token = getAuthToken();
    if (!token || !task) return;

    await fetch(`/api/tasks/${task.id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function addComment(event: FormEvent) {
    event.preventDefault();
    const token = getAuthToken();
    if (!token || !task) return;

    const response = await fetch(`/api/tasks/${task.id}/comments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to save comment.");
      return;
    }
    setBody("");
    await load();
  }

  return (
    <DashboardPageShell
      title="Task Detail"
      description="Update task status and keep internal comments in one place."
      allowedRoles={["SUPER_ADMIN", "ADMIN", "SUPPORT", "FRONTEND_DEVELOPER", "BACKEND_DEVELOPER", "FULLSTACK_DEVELOPER", "MARKETING", "VIDEO_EDITOR", "FINANCE", "COMPLIANCE"]}
      menuItems={developerMenu}
    >
      <div className="max-w-5xl space-y-6">
        <Link href="/staff/tasks" className="text-sm font-semibold text-blue-600">Back to tasks</Link>
        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {task && (
          <>
            <Card className="border-slate-200 bg-white">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{task.title}</CardTitle>
                  <p className="mt-2 text-sm text-slate-600">{project?.title || "Project"} / {task.roleCategory}</p>
                  <p className="text-xs text-slate-500">{task.priority} priority / {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
                </div>
                <Select value={task.status} onValueChange={updateStatus}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-slate-700">{task.description}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-950">{comment.authorName}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{comment.body}</p>
                    <p className="mt-2 text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-sm text-slate-500">No comments yet.</p>}
                <form className="space-y-3" onSubmit={addComment}>
                  <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add comment..." className="min-h-28" />
                  <Button disabled={body.trim().length < 2}>Save Comment</Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardPageShell>
  );
}
