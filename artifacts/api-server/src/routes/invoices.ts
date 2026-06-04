import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { sendInvoiceNotificationEmail } from "../lib/email";
import { requireAuth, requireRoles } from "../middleware/auth";

const router: IRouter = Router();

const invoiceNotificationSchema = z.object({
  to: z.string().trim().email().max(255),
  name: z.string().trim().min(2).max(160),
  invoiceNumber: z.string().trim().min(1).max(80),
  amount: z.string().trim().min(1).max(80),
});

router.post(
  "/admin/invoices/notify",
  requireAuth,
  requireRoles(["SUPER_ADMIN", "ADMIN", "FINANCE"]),
  async (req, res) => {
    const parsed = invoiceNotificationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid invoice notification.", errors: parsed.error.flatten() });
      return;
    }

    const email = await sendInvoiceNotificationEmail(parsed.data);
    res.status(201).json({ email });
  },
);

export default router;
