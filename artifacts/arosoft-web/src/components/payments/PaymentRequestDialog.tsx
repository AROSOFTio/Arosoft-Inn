import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PaymentMethod = "MTN_MOMO" | "AIRTEL_MONEY" | "BANK_TRANSFER" | "REQUEST_INVOICE";
type PaymentItemType = "SCRIPT_TEMPLATE" | "COURSE" | "WEBSITE_PACKAGE" | "SYSTEM_PACKAGE" | "SUPPORT_PACKAGE" | "ACADEMY_PACKAGE";

interface PaymentRequestDialogProps {
  itemType: PaymentItemType;
  itemName: string;
  amount: string;
  itemId?: string;
  triggerLabel: string;
  triggerClassName?: string;
  triggerVariant?: "default" | "outline";
}

const methods: Array<{ value: PaymentMethod; label: string; description: string }> = [
  { value: "MTN_MOMO", label: "MTN MoMo", description: "Submit your mobile money details for confirmation." },
  { value: "AIRTEL_MONEY", label: "Airtel Money", description: "Use Airtel Money and wait for finance follow-up." },
  { value: "BANK_TRANSFER", label: "Bank Transfer", description: "Receive bank details and payment confirmation." },
  { value: "REQUEST_INVOICE", label: "Request Invoice", description: "Finance will prepare an invoice before payment." },
];

export function PaymentRequestDialog({
  itemType,
  itemName,
  amount,
  itemId,
  triggerLabel,
  triggerClassName,
  triggerVariant = "default",
}: PaymentRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("MTN_MOMO");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitPaymentRequest() {
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          organization,
          itemType,
          itemId,
          itemName,
          amount,
          method,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit payment request.");
      }

      setMessage("Payment request submitted. Finance will contact you with next steps.");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setOrganization("");
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit payment request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClassName}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle>Request payment instructions</DialogTitle>
          <DialogDescription>
            Choose a payment method for {itemName}. No automatic charge is made yet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-950">{itemName}</p>
            <p className="text-sm text-slate-600">{amount}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {methods.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMethod(option.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  method === option.value
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="block text-sm font-semibold">{option.label}</span>
                <span className="mt-1 block text-xs text-slate-500">{option.description}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="Full name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
            <Input placeholder="Email" type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} />
            <Input placeholder="Phone" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} />
            <Input placeholder="Company / organization" value={organization} onChange={(event) => setOrganization(event.target.value)} />
          </div>

          <Textarea placeholder="Notes or invoice details" value={notes} onChange={(event) => setNotes(event.target.value)} />

          {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</p>}

          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={isSubmitting || !customerName || !customerEmail}
            onClick={submitPaymentRequest}
          >
            {isSubmitting ? "Submitting..." : "Submit Payment Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
