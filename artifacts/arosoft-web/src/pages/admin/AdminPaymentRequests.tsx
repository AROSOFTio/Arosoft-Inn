import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAuthToken } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { adminMenu } from "@/components/dashboard/dashboardData";

type PaymentStatus = "PENDING_PAYMENT" | "PAID" | "CANCELLED";

interface PaymentRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  organization?: string | null;
  itemType: string;
  itemName: string;
  amount: string;
  method: string;
  status: PaymentStatus;
  notes?: string | null;
  createdAt: string;
}

const statuses: PaymentStatus[] = ["PENDING_PAYMENT", "PAID", "CANCELLED"];

export default function AdminPaymentRequests() {
  const [, navigate] = useLocation();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [error, setError] = useState("");

  function loadPaymentRequests() {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("/api/admin/payment-requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load payment requests.");
        return response.json() as Promise<{ paymentRequests: PaymentRequest[] }>;
      })
      .then((data) => setPaymentRequests(data.paymentRequests))
      .catch((err: Error) => setError(err.message));
  }

  useEffect(() => {
    loadPaymentRequests();
  }, []);

  async function updateStatus(id: string, status: PaymentStatus) {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setError("");
    const response = await fetch(`/api/admin/payment-requests/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setError("Unable to update payment status.");
      return;
    }

    loadPaymentRequests();
  }

  return (
    <DashboardPageShell
      title="Payment Requests"
      description="Review manual payment intents for scripts, courses, packages, and invoice requests."
      allowedRoles={["SUPER_ADMIN", "ADMIN", "FINANCE"]}
      menuItems={adminMenu}
    >
      <div className="space-y-6">
        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Card className="border-slate-200 bg-white">
          <CardHeader><CardTitle>Requests</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {paymentRequests.map((request) => (
              <div key={request.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-950">{request.itemName}</p>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">{request.amount}</Badge>
                      <Badge variant="outline">{request.status.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {request.itemType.replace(/_/g, " ")} / {request.method.replace(/_/g, " ")}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {request.customerName} / {request.customerEmail}
                      {request.customerPhone ? ` / ${request.customerPhone}` : ""}
                    </p>
                    {request.organization && <p className="mt-1 text-sm text-slate-500">{request.organization}</p>}
                    {request.notes && <p className="mt-2 text-sm text-slate-600">{request.notes}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={request.status === status ? "default" : "outline"}
                        className={request.status === status ? "bg-blue-600 text-white hover:bg-blue-700" : "border-slate-200"}
                        onClick={() => updateStatus(request.id, status)}
                      >
                        {status.replace(/_/g, " ")}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {paymentRequests.length === 0 && <p className="text-sm text-slate-500">No payment requests yet.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
