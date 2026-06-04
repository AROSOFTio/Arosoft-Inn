import { FormEvent, useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { studentMenu } from "@/components/dashboard/dashboardData";

interface Quiz { id: string; title: string }
interface Question { id: string; question: string; options: string[]; explanation?: string | null }
interface Result { questionId: string; correctAnswer: string; explanation?: string | null; isCorrect: boolean }

export default function TakeQuiz() {
  const [, params] = useRoute("/student/quizzes/:id");
  const [, navigate] = useLocation();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !params?.id) {
      navigate("/login");
      return;
    }
    fetch(`/api/student/quizzes/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load quiz.");
        return response.json() as Promise<{ quiz: Quiz; questions: Question[] }>;
      })
      .then((data) => {
        setQuiz(data.quiz);
        setQuestions(data.questions);
      })
      .catch((err: Error) => setError(err.message));
  }, [navigate, params?.id]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const token = getAuthToken();
    if (!token || !quiz) return;
    const response = await fetch(`/api/student/quizzes/${quiz.id}/attempt`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = (await response.json()) as { attempt?: { score: number }; results?: Result[]; message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to submit quiz.");
      return;
    }
    setScore(data.attempt?.score ?? 0);
    setResults(data.results ?? []);
  }

  return (
    <DashboardPageShell title={quiz?.title ?? "Quiz"} description="Answer questions and submit your attempt." allowedRoles={["STUDENT"]} menuItems={studentMenu}>
      <Card className="border-slate-200 bg-white">
        <CardHeader><CardTitle>{score === null ? "Questions" : `Result: ${score}%`}</CardTitle></CardHeader>
        <CardContent>
          {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
          <form className="space-y-5" onSubmit={submit}>
            {questions.map((question) => {
              const result = results.find((item) => item.questionId === question.id);
              return (
                <div key={question.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{question.question}</p>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm">
                        <input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} disabled={score !== null} />
                        {option}
                      </label>
                    ))}
                  </div>
                  {result && <p className={`mt-3 text-sm ${result.isCorrect ? "text-green-700" : "text-red-700"}`}>{result.isCorrect ? "Correct" : `Correct answer: ${result.correctAnswer}`}. {result.explanation}</p>}
                </div>
              );
            })}
            {score === null && <Button>Submit Quiz</Button>}
          </form>
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
