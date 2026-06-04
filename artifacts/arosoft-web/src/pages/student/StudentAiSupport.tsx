import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bot, Send } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { studentMenu } from "@/components/dashboard/dashboardData";

interface ProgressGuide {
  nextLesson?: { title: string } | null;
  pendingQuiz?: { title: string } | null;
  pendingAssignment?: { title: string } | null;
  completionPercentage: number;
}

interface Message {
  role: "student" | "assistant";
  text: string;
}

export default function StudentAiSupport() {
  const [, navigate] = useLocation();
  const [guide, setGuide] = useState<ProgressGuide | null>(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Ask about your course, next lesson, quizzes, assignments, or progress." },
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/student/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load learning guide.");
        return response.json() as Promise<{ guide: ProgressGuide }>;
      })
      .then((data) => setGuide(data.guide))
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  async function ask(event: FormEvent) {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;

    const localContext = [
      guide?.nextLesson ? `Next lesson: ${guide.nextLesson.title}` : "No pending lesson found.",
      guide?.pendingQuiz ? `Pending quiz: ${guide.pendingQuiz.title}` : "No pending quiz found.",
      guide?.pendingAssignment ? `Pending assignment: ${guide.pendingAssignment.title}` : "No pending assignment found.",
      `Average completion: ${guide?.completionPercentage ?? 0}%`,
    ];

    setMessages((current) => [...current, { role: "student", text }]);
    setQuery("");

    const response = await fetch("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text, context: localContext }),
    });
    const data = (await response.json()) as { reply?: string; message?: string };
    setMessages((current) => [...current, { role: "assistant", text: data.reply ?? data.message ?? "I could not answer that yet." }]);
  }

  return (
    <DashboardPageShell title="AI Support" description="Study support using local course knowledge, retrieval placeholders, and confidence checks." allowedRoles={["STUDENT"]} menuItems={studentMenu}>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Learning Guide</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {error && <p className="text-red-700">{error}</p>}
            <p>Next lesson: {guide?.nextLesson?.title ?? "No pending lesson"}</p>
            <p>Pending quiz: {guide?.pendingQuiz?.title ?? "No pending quiz"}</p>
            <p>Pending assignment: {guide?.pendingAssignment?.title ?? "No pending assignment"}</p>
            <p>Completion: {guide?.completionPercentage ?? 0}%</p>
            <p className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
              Internal support uses fixed knowledge, local content retrieval placeholders, and confidence checks before handing off.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bot size={18} /> Student Assistant</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4 max-h-96 space-y-3 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`rounded-lg px-3 py-2 text-sm ${message.role === "student" ? "ml-10 bg-blue-600 text-white" : "mr-10 bg-slate-50 text-slate-700"}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={ask}>
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask for study guidance..." />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Send size={16} /></Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
