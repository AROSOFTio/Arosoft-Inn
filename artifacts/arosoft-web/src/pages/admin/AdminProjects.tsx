import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserOption {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: string;
  budget?: string | null;
  deadline?: string | null;
}

const statuses = ["PLANNING", "ASSIGNED", "IN_PROGRESS", "REVIEW", "COMPLETED", "CANCELLED", "MAINTENANCE"];

export default function AdminProjects() {
  const [, navigate] = useLocation();
  const [clients, setClients] = useState<UserOption[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PLANNING");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const [projectResponse, clientResponse] = await Promise.all([
      fetch("/api/admin/projects", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/admin/clients", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    if (!projectResponse.ok || !clientResponse.ok) throw new Error("Unable to load projects.");
    const projectData = (await projectResponse.json()) as { projects: Project[] };
    const clientData = (await clientResponse.json()) as { users: UserOption[] };
    setProjects(projectData.projects);
    setClients(clientData.users);
    setClientId((current) => current || clientData.users[0]?.id || "");
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

    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, title, description, status, budget, deadline }),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to create project.");
      return;
    }

    setNotice("Project created.");
    setTitle("");
    setDescription("");
    setBudget("");
    setDeadline("");
    setStatus("PLANNING");
    await load();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Create Project</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((client) => <SelectItem key={client.id} value={client.id}>{client.name} - {client.email}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project title" required />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Project description" className="min-h-28" required />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Budget" />
              <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
              <Button disabled={!clientId}>Create Project</Button>
              {notice && <p className="text-sm text-green-700">{notice}</p>}
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{project.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                    <p className="mt-2 text-xs text-slate-500">{project.budget || "No budget"} / {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{project.status}</span>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-slate-500">No projects yet.</p>}
            <Link href="/admin/tasks" className="inline-flex text-sm font-semibold text-blue-600">Manage tasks</Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
