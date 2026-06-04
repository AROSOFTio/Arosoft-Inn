import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { studentMenu } from "@/components/dashboard/dashboardData";

interface ProgressData {
  enrollments: Array<{ enrollment: { id: string; progress: number; status: string }; course: { title: string } }>;
  guide: {
    nextLesson?: { title: string } | null;
    pendingAssignment?: { title: string } | null;
    completionPercentage: number;
  };
}

export default function StudentProgress() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<ProgressData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("/api/student/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load progress.");
        return response.json() as Promise<ProgressData>;
      })
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  return (
    <DashboardPageShell title="Progress" description="Monitor completion and next learning steps." allowedRoles={["STUDENT"]} menuItems={studentMenu}>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Progress Guide</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {error && <p className="text-sm text-red-700">{error}</p>}
            <Progress value={data?.guide.completionPercentage ?? 0} className="h-2" />
            <p className="text-sm text-slate-600">{data?.guide.completionPercentage ?? 0}% average completion</p>
            <p className="text-sm text-slate-700">Next lesson: {data?.guide.nextLesson?.title ?? "No pending lesson"}</p>
            <p className="text-sm text-slate-700">Pending assignment: {data?.guide.pendingAssignment?.title ?? "No pending assignment"}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Course Completion</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data?.enrollments.map(({ enrollment, course }) => (
              <div key={enrollment.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex justify-between text-sm font-semibold text-slate-950">
                  <span>{course.title}</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="mt-3 h-2" />
              </div>
            ))}
            {data?.enrollments.length === 0 && <p className="text-sm text-slate-500">No progress yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
