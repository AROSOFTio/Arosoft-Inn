import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  paymentMethodSchema,
  paymentRequestsTable,
  paymentRequestStatusSchema,
  paymentRequestTypeSchema,
  type UserRole,
} from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { audit } from "../lib/audit";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN", "FINANCE"];

const paymentRequestSchema = z.object({
  customerName: z.string().trim().min(2).max(160),
  customerEmail: z.email().max(255),
  customerPhone: z.string().trim().max(80).optional().nullable(),
  organization: z.string().trim().max(180).optional().nullable(),
  itemType: paymentRequestTypeSchema,
  itemId: z.uuid().optional().nullable(),
  itemName: z.string().trim().min(2).max(220),
  amount: z.string().trim().min(1).max(80),
  method: paymentMethodSchema,
  notes: z.string().trim().max(1000).optional().nullable(),
});

const paymentRequestUpdateSchema = z.object({
  status: paymentRequestStatusSchema,
});

router.post("/payment-requests", async (req, res) => {
  const parsed = paymentRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payment request.", errors: parsed.error.flatten() });
    return;
  }

  const [paymentRequest] = await db
    .insert(paymentRequestsTable)
    .values({
      ...parsed.data,
      customerEmail: parsed.data.customerEmail.toLowerCase(),
      status: "PENDING_PAYMENT",
    })
    .returning();

  audit("payment_request.created", {
    paymentRequestId: paymentRequest.id,
    itemType: paymentRequest.itemType,
    itemName: paymentRequest.itemName,
    method: paymentRequest.method,
  });

  res.status(201).json({ paymentRequest });
});

router.get(
  "/admin/payment-requests",
  requireAuth,
  requireRoles(adminRoles),
  async (_req, res) => {
    const paymentRequests = await db
      .select()
      .from(paymentRequestsTable)
      .orderBy(desc(paymentRequestsTable.createdAt));

    res.json({ paymentRequests });
  },
);

router.patch(
  "/admin/payment-requests/:id",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const paymentRequestId = getRouteParam(req.params.id);
    if (!paymentRequestId) {
      res.status(404).json({ message: "Payment request not found." });
      return;
    }

    const parsed = paymentRequestUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid payment request update.", errors: parsed.error.flatten() });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [paymentRequest] = await db
      .update(paymentRequestsTable)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(paymentRequestsTable.id, paymentRequestId))
      .returning();

    if (!paymentRequest) {
      res.status(404).json({ message: "Payment request not found." });
      return;
    }

    audit("payment_request.updated", {
      actorId: user.id,
      paymentRequestId: paymentRequest.id,
      status: paymentRequest.status,
    });

    res.json({ paymentRequest });
  },
);

export default router;
