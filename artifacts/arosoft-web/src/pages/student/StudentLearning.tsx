import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { studentMenu } from "@/components/dashboard/dashboardData";

interface EnrollmentRow {
  enrollment: { id: string; courseId: string; progress: number; status: string };
  course: { id: string; title: string; category: string; level: string; duration: string; description: string };
}

export default function StudentLearning() {
  const [, navigate] = useLocation();
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("/api/student/enrollments", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load learning.");
        return response.json() as Promise<{ enrollments: EnrollmentRow[] }>;
      })
      .then((data) => setEnrollments(data.enrollments))
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  return (
    <DashboardPageShell title="My Learning" description="Open enrolled courses and continue lessons." allowedRoles={["STUDENT"]} menuItems={studentMenu}>
      <div className="space-y-5">
        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map(({ enrollment, course }) => (
            <Card key={enrollment.id} className="border-slate-200 bg-white">
              <CardHeader className="pb-3"><CardTitle>{course.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>{enrollment.status}</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </div>
                <Link href={`/student/courses/${course.id}/learn`} className="mt-4 block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Continue Learning</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {enrollments.length === 0 && <p className="text-sm text-slate-500">No enrollments yet. Open Academy and enroll in a free course.</p>}
      </div>
    </DashboardPageShell>
  );
}
