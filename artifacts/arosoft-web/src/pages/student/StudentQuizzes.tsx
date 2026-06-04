import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { studentMenu } from "@/components/dashboard/dashboardData";

interface QuizRow {
  quiz: { id: string; title: string };
  course: { title: string };
}

export default function StudentQuizzes() {
  const [, navigate] = useLocation();
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("/api/student/quizzes", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load quizzes.");
        return response.json() as Promise<{ quizzes: QuizRow[] }>;
      })
      .then((data) => setQuizzes(data.quizzes))
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  return (
    <DashboardPageShell title="Quizzes" description="Take quizzes from enrolled courses." allowedRoles={["STUDENT"]} menuItems={studentMenu}>
      <Card className="border-slate-200 bg-white">
        <CardHeader><CardTitle>Available Quizzes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {error && <p className="text-sm text-red-700">{error}</p>}
          {quizzes.map(({ quiz, course }) => (
            <Link key={quiz.id} href={`/student/quizzes/${quiz.id}`} className="block rounded-lg border border-slate-200 p-4 hover:bg-blue-50/40">
              <p className="font-semibold text-slate-950">{quiz.title}</p>
              <p className="text-sm text-slate-600">{course.title}</p>
            </Link>
          ))}
          {quizzes.length === 0 && <p className="text-sm text-slate-500">No quizzes available yet.</p>}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
