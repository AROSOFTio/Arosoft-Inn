import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { studentMenu } from "@/components/dashboard/dashboardData";

interface Lesson { id: string; title: string; content: string; videoUrl?: string | null; order: number }
interface Quiz { id: string; title: string }
interface Task { id: string; title: string; status: string }
interface Course { id: string; title: string; description: string }
interface Enrollment { id: string; progress: number; status: string }

export default function StudentCourseLearn() {
  const [, params] = useRoute("/student/courses/:id/learn");
  const [, navigate] = useLocation();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token || !params?.id) {
      navigate("/login");
      return;
    }
    const response = await fetch(`/api/student/courses/${params.id}/learn`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Unable to load course.");
    const data = (await response.json()) as { course: Course; lessons: Lesson[]; quizzes: Quiz[]; tasks: Task[]; enrollment: Enrollment };
    setCourse(data.course);
    setLessons(data.lessons);
    setQuizzes(data.quizzes);
    setTasks(data.tasks);
    setEnrollment(data.enrollment);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, [params?.id]);

  async function updateProgress(progress: number) {
    const token = getAuthToken();
    if (!token || !enrollment) return;
    const response = await fetch(`/api/student/enrollments/${enrollment.id}/progress`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    });
    if (response.ok) await load();
  }

  return (
    <DashboardPageShell title={course?.title ?? "Course"} description={course?.description ?? "Continue enrolled course lessons."} allowedRoles={["STUDENT"]} menuItems={studentMenu}>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Lessons</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {error && <p className="text-sm text-red-700">{error}</p>}
            {lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-lg border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{lesson.order}. {lesson.title}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{lesson.content}</p>
                {lesson.videoUrl && <a href={lesson.videoUrl} className="mt-2 inline-block text-sm font-semibold text-blue-600">Open video</a>}
              </div>
            ))}
            {lessons.length === 0 && <p className="text-sm text-slate-500">No lessons have been added yet.</p>}
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className="border-slate-200 bg-white">
            <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Progress value={enrollment?.progress ?? 0} className="h-2" />
              <p className="text-sm text-slate-600">{enrollment?.progress ?? 0}% complete</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => updateProgress(Math.min(100, (enrollment?.progress ?? 0) + 25))}>+25%</Button>
                <Button size="sm" onClick={() => updateProgress(100)}>Complete</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardHeader><CardTitle>Quizzes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quizzes.map((quiz) => <Link key={quiz.id} href={`/student/quizzes/${quiz.id}`} className="block rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-blue-700">{quiz.title}</Link>)}
              {quizzes.length === 0 && <p className="text-sm text-slate-500">No quizzes yet.</p>}
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardHeader><CardTitle>Assignments</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {tasks.map((task) => <p key={task.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm">{task.title} / {task.status}</p>)}
              {tasks.length === 0 && <p className="text-sm text-slate-500">No assignments yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
