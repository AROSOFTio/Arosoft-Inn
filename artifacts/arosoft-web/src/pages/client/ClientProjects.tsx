import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { clientMenu } from "@/components/dashboard/dashboardData";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget?: string | null;
  deadline?: string | null;
}

interface Task {
  id: string;
  title: string;
  status: string;
}

export default function ClientProjects() {
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  async function loadProjects() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("/api/client/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load projects.");
    const data = (await response.json()) as { projects: Project[] };
    setProjects(data.projects);
    if (data.projects[0]) await loadProject(data.projects[0].id);
  }

  async function loadProject(projectId: string) {
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`/api/client/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load project progress.");
    const data = (await response.json()) as { project: Project; tasks: Task[] };
    setSelectedProject(data.project);
    setTasks(data.tasks);
  }

  useEffect(() => {
    loadProjects().catch((err: Error) => setError(err.message));
  }, []);

  return (
    <DashboardPageShell
      title="Client Projects"
      description="View your project progress and approved status updates."
      allowedRoles={["CLIENT"]}
      menuItems={clientMenu}
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>My Projects</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {error && <p className="text-sm text-red-700">{error}</p>}
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className="block w-full rounded-lg border border-slate-200 p-4 text-left hover:bg-blue-50/40"
                onClick={() => loadProject(project.id).catch((err: Error) => setError(err.message))}
              >
                <p className="font-semibold text-slate-950">{project.title}</p>
                <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{project.status}</span>
              </button>
            ))}
            {projects.length === 0 && <p className="text-sm text-slate-500">No projects yet.</p>}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>{selectedProject?.title || "Project Progress"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {selectedProject && (
              <>
                <p className="text-sm text-slate-700">{selectedProject.description}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <Info label="Status" value={selectedProject.status} />
                  <Info label="Budget" value={selectedProject.budget || "Pending"} />
                  <Info label="Deadline" value={selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : "Pending"} />
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-slate-950">Progress Updates</p>
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                      <span className="text-slate-700">{task.title}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{task.status}</span>
                    </div>
                  ))}
                  {tasks.length === 0 && <p className="text-sm text-slate-500">No progress updates yet.</p>}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
