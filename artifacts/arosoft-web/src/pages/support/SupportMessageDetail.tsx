import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { supportMenu } from "@/components/dashboard/dashboardData";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  reason: string;
  priority: string;
  subject: string;
  message: string;
  attachmentUrl?: string | null;
  status: string;
  createdAt: string;
}

interface ContactReply {
  id: string;
  authorName: string;
  body: string;
  emailSent: boolean;
  emailSkippedReason?: string | null;
  createdAt: string;
}

export default function SupportMessageDetail() {
  const [, params] = useRoute("/support/messages/:id");
  const [, navigate] = useLocation();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [replies, setReplies] = useState<ContactReply[]>([]);
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token || !params?.id) {
      navigate("/login");
      return;
    }

    const response = await fetch(`/api/support/messages/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Unable to load message.");
    const data = (await response.json()) as { message: ContactMessage; replies: ContactReply[] };
    setMessage(data.message);
    setReplies(data.replies);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, [params?.id]);

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    const token = getAuthToken();
    if (!token || !message) return;

    const response = await fetch(`/api/support/messages/${message.id}/reply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: reply }),
    });
    const data = (await response.json()) as { email?: { sent: boolean; skippedReason?: string | null }; message?: string };

    if (!response.ok) {
      setError(data.message ?? "Unable to save reply.");
      return;
    }

    setReply("");
    setNotice(data.email?.sent ? "Reply saved and email sent." : `Reply saved. Email skipped: ${data.email?.skippedReason ?? "SMTP missing"}`);
    await load();
  }

  async function updateStatus(status: string) {
    const token = getAuthToken();
    if (!token || !message) return;
    await fetch(`/api/support/messages/${message.id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <DashboardPageShell
      title="Support Message"
      description="View the message thread, update status, and save replies."
      allowedRoles={["SUPER_ADMIN", "ADMIN", "SUPPORT"]}
      menuItems={supportMenu}
    >
      <div className="max-w-5xl space-y-6">
        <Link href="/support/messages" className="text-sm font-semibold text-blue-600">Back to inbox</Link>
        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
        {message && (
          <>
            <Card className="border-slate-200 bg-white">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{message.subject}</CardTitle>
                  <p className="mt-2 text-sm text-slate-600">{message.fullName} - {message.email}</p>
                  <p className="text-xs text-slate-500">{message.reason} / {message.priority}</p>
                </div>
                <Select value={message.status} onValueChange={updateStatus}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">NEW</SelectItem>
                    <SelectItem value="OPEN">OPEN</SelectItem>
                    <SelectItem value="REPLIED">REPLIED</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700">{message.message}</p>
                {message.attachmentUrl && <a className="text-sm font-semibold text-blue-600" href={message.attachmentUrl}>View attachment</a>}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader><CardTitle>Thread</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {replies.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-950">{item.authorName}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.emailSent ? "Email sent" : `Email skipped: ${item.emailSkippedReason}`}</p>
                  </div>
                ))}
                <form className="space-y-3" onSubmit={sendReply}>
                  <Textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write reply..." className="min-h-32" />
                  <Button disabled={reply.trim().length < 2}>Save Reply</Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardPageShell>
  );
}
