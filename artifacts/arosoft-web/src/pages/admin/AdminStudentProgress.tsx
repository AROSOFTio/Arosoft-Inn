import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { adminMenu } from "@/components/dashboard/dashboardData";

interface EnrollmentRow {
  enrollment: { id: string; progress: number; status: string; updatedAt: string };
  course: { title: string };
  student: { name: string; email: string };
}

export default function AdminStudentProgress() {
  const [, navigate] = useLocation();
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("/api/admin/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load student progress.");
        return response.json() as Promise<{ enrollments: EnrollmentRow[] }>;
      })
      .then((data) => setEnrollments(data.enrollments))
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  return (
    <DashboardPageShell title="Student Progress" description="Monitor academy enrollments and course completion." allowedRoles={["SUPER_ADMIN", "ADMIN"]} menuItems={adminMenu}>
      <Card className="border-slate-200 bg-white">
        <CardHeader><CardTitle>Enrollments</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {error && <p className="text-sm text-red-700">{error}</p>}
          {enrollments.map(({ enrollment, course, student }) => (
            <div key={enrollment.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{course.title}</p>
                  <p className="text-xs text-slate-500">{student.name} / {student.email}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{enrollment.status}</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={enrollment.progress} className="h-2" />
                <span className="w-12 text-right text-sm font-semibold">{enrollment.progress}%</span>
              </div>
            </div>
          ))}
          {enrollments.length === 0 && <p className="text-sm text-slate-500">No student enrollments yet.</p>}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
