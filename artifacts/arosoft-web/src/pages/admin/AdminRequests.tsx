import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientRequest {
  id: string;
  serviceType: string;
  title: string;
  budgetRange?: string | null;
  status: string;
  aiSummary?: string | null;
}

export default function AdminRequests() {
  const [, navigate] = useLocation();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/admin/requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load admin requests.");
        return response.json() as Promise<{ requests: ClientRequest[] }>;
      })
      .then((data) => setRequests(data.requests))
      .catch((err: Error) => setError(err.message));
  }, [navigate]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Admin</p>
          <h1 className="text-2xl font-bold text-slate-950">Client Requests</h1>
        </header>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Requests</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {requests.map((request) => (
              <Link key={request.id} href={`/admin/requests/${request.id}`} className="block rounded-lg border border-slate-200 p-4 hover:bg-blue-50/40">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{request.title}</p>
                    <p className="text-sm text-slate-600">{request.serviceType.replace(/_/g, " ")} / {request.budgetRange || "No budget"}</p>
                    <p className="mt-2 text-sm text-slate-600">{request.aiSummary}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{request.status}</span>
                </div>
              </Link>
            ))}
            {requests.length === 0 && <p className="text-sm text-slate-500">No client requests yet.</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
