import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { adminMenu } from "@/components/dashboard/dashboardData";

interface ClientRequest {
  id: string;
  serviceType: string;
  title: string;
  description: string;
  budgetRange?: string | null;
  expectedTimeline?: string | null;
  attachmentUrl?: string | null;
  aiSummary?: string | null;
  aiSuggestedPriceRange?: string | null;
  aiMissingQuestions: string[];
  aiSuggestedTimeline?: string | null;
  aiSuggestedTaskCategories: string[];
  status: string;
  convertedProjectId?: string | null;
}

const statuses = ["DRAFT", "SUBMITTED", "AI_REVIEWED", "ADMIN_REVIEW", "QUOTED", "ACCEPTED", "REJECTED", "CONVERTED_TO_PROJECT"];

export default function AdminRequestDetail() {
  const [, params] = useRoute("/admin/requests/:id");
  const [, navigate] = useLocation();
  const [request, setRequest] = useState<ClientRequest | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const token = getAuthToken();
    if (!token || !params?.id) {
      navigate("/login");
      return;
    }
    const response = await fetch(`/api/admin/requests/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unable to load request.");
    const data = (await response.json()) as { request: ClientRequest };
    setRequest(data.request);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, [params?.id]);

  async function updateStatus(status: string) {
    const token = getAuthToken();
    if (!token || !request) return;
    await fetch(`/api/admin/requests/${request.id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function convert() {
    const token = getAuthToken();
    if (!token || !request) return;
    const response = await fetch(`/api/admin/requests/${request.id}/convert-to-project`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await response.json()) as { projectId?: string; message?: string };
    if (!response.ok) {
      setError(data.message ?? "Unable to convert request.");
      return;
    }
    setNotice(`Converted to project: ${data.projectId}`);
    await load();
  }

  return (
    <DashboardPageShell
      title="Request Details"
      description="Review a client request and convert it into a project."
      allowedRoles={["SUPER_ADMIN", "ADMIN"]}
      menuItems={adminMenu}
    >
      <div className="max-w-5xl space-y-6">
        <Link href="/admin/requests" className="text-sm font-semibold text-blue-600">Back to requests</Link>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {notice && <p className="text-sm text-green-700">{notice}</p>}
        {request && (
          <Card className="border-slate-200 bg-white">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>{request.title}</CardTitle>
                <p className="mt-2 text-sm text-slate-600">{request.serviceType.replace(/_/g, " ")}</p>
              </div>
              <Select value={request.status} onValueChange={updateStatus}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="whitespace-pre-wrap text-sm text-slate-700">{request.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Budget" value={request.budgetRange || "Not provided"} />
                <Info label="Timeline" value={request.expectedTimeline || "Not provided"} />
                <Info label="AI Price Range" value={request.aiSuggestedPriceRange || "Not generated"} />
                <Info label="AI Timeline" value={request.aiSuggestedTimeline || "Not generated"} />
              </div>
              <div>
                <p className="font-semibold text-slate-950">AI Summary</p>
                <p className="mt-1 text-sm text-slate-700">{request.aiSummary}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Missing Questions</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {request.aiMissingQuestions.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              {request.attachmentUrl && <a className="text-sm font-semibold text-blue-600" href={request.attachmentUrl}>View requirement file</a>}
              <Button onClick={convert} disabled={request.status === "CONVERTED_TO_PROJECT"}>Convert to Project</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
