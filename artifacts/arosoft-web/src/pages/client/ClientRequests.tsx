import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { clientMenu } from "@/components/dashboard/dashboardData";

interface ClientRequest {
  id: string;
  serviceType: string;
  title: string;
  description: string;
  status: string;
  aiSummary?: string | null;
  createdAt: string;
}

const serviceTypes = [
  "WEBSITE",
  "WEB_SYSTEM",
  "MOBILE_APP",
  "SCRIPT_TEMPLATE",
  "ACADEMY_SUPPORT",
  "VIDEO_PRODUCTION",
  "DIGITAL_MARKETING",
  "BRANDING",
  "CONSULTATION",
  "OTHER",
];

export default function ClientRequests() {
  const [, navigate] = useLocation();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [serviceType, setServiceType] = useState("WEBSITE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [expectedTimeline, setExpectedTimeline] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    const response = await fetch("/api/client/requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load requests.");
    const data = (await response.json()) as { requests: ClientRequest[] };
    setRequests(data.requests);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const token = getAuthToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("serviceType", serviceType);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("budgetRange", budgetRange);
    formData.append("expectedTimeline", expectedTimeline);
    if (attachment) formData.append("attachment", attachment);

    const response = await fetch("/api/client/requests", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to submit request.");
      return;
    }
    setNotice("Request submitted and AI review generated.");
    setTitle("");
    setDescription("");
    setBudgetRange("");
    setExpectedTimeline("");
    setAttachment(null);
    await load();
  }

  return (
    <DashboardPageShell
      title="Client Requests"
      description="Submit service requests and review generated AI request summaries."
      allowedRoles={["CLIENT"]}
      menuItems={clientMenu}
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>New Client Request</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{serviceTypes.map((item) => <SelectItem key={item} value={item}>{item.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Request title" required />
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what you need..." className="min-h-32" required />
              <Input value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)} placeholder="Budget range" />
              <Input value={expectedTimeline} onChange={(event) => setExpectedTimeline(event.target.value)} placeholder="Expected timeline" />
              <Input type="file" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} />
              <Button>Submit Request</Button>
              {notice && <p className="text-sm text-green-700">{notice}</p>}
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>My Requests</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{request.title}</p>
                    <p className="text-sm text-slate-600">{request.serviceType.replace(/_/g, " ")}</p>
                    <p className="mt-2 text-sm text-slate-600">{request.aiSummary}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{request.status}</span>
                </div>
              </div>
            ))}
            {requests.length === 0 && <p className="text-sm text-slate-500">No client requests yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
