import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { supportMenu } from "@/components/dashboard/dashboardData";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  reason: string;
  priority: string;
  subject: string;
  status: string;
  createdAt: string;
}

export default function SupportInbox() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/support/messages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load support inbox.");
        return response.json() as Promise<{ messages: ContactMessage[] }>;
      })
      .then((data) => setMessages(data.messages))
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  return (
    <DashboardPageShell
      title="Support Inbox"
      description="Review contact messages and open support threads."
      allowedRoles={["SUPER_ADMIN", "ADMIN", "SUPPORT"]}
      menuItems={supportMenu}
    >
      <div className="max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Support</p>
            <h1 className="text-2xl font-bold text-slate-950">Inbox</h1>
          </div>
          <Link href="/support"><Button variant="outline">Dashboard</Button></Link>
        </header>
        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Contact Messages</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {messages.map((message) => (
              <Link
                key={message.id}
                href={`/support/messages/${message.id}`}
                className="block rounded-lg border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{message.subject}</p>
                    <p className="text-sm text-slate-600">{message.fullName} - {message.email}</p>
                    <p className="text-xs text-slate-500">{message.reason} / {message.priority}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{message.status}</span>
                </div>
              </Link>
            ))}
            {messages.length === 0 && <p className="text-sm text-slate-500">No support messages yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
