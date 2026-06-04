import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db, contactMessagesTable } from "@workspace/db";
import { createUpload, fileToUrl } from "../lib/uploads";

const router: IRouter = Router();
const upload = createUpload("contact");

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
  phone: z.string().trim().max(80).optional().nullable(),
  organization: z.string().trim().max(180).optional().nullable(),
  reason: z.string().trim().min(1).max(120),
  priority: z.string().trim().min(1).max(40).default("Normal"),
  subject: z.string().trim().min(2).max(240),
  message: z.string().trim().min(10),
});

router.post("/contact", upload.single("attachment"), async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid contact message.", errors: parsed.error.flatten() });
    return;
  }

  const [message] = await db
    .insert(contactMessagesTable)
    .values({
      ...parsed.data,
      attachmentUrl: fileToUrl(req.file),
      status: "NEW",
      source: "PUBLIC_CONTACT_FORM",
    })
    .returning();

  res.status(201).json({ message });
});

export default router;
