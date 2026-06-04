import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  contactMessagesTable,
  contactRepliesTable,
  contactStatusSchema,
  db,
} from "@workspace/db";
import { sendSupportReplyEmail } from "../lib/email";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

const supportRoles = ["SUPER_ADMIN", "ADMIN", "SUPPORT"] as const;
const replySchema = z.object({
  body: z.string().trim().min(2),
});
const statusSchema = z.object({
  status: contactStatusSchema,
});

router.get(
  "/support/messages",
  requireAuth,
  requireRoles([...supportRoles]),
  async (_req, res) => {
    const messages = await db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt));

    res.json({ messages });
  },
);

router.get(
  "/support/messages/:id",
  requireAuth,
  requireRoles([...supportRoles]),
  async (req, res) => {
    const [message] = await db
      .select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, req.params.id))
      .limit(1);

    if (!message) {
      res.status(404).json({ message: "Contact message not found." });
      return;
    }

    if (message.status === "NEW") {
      await db
        .update(contactMessagesTable)
        .set({ status: "OPEN", updatedAt: new Date() })
        .where(eq(contactMessagesTable.id, message.id));
      message.status = "OPEN";
    }

    const replies = await db
      .select()
      .from(contactRepliesTable)
      .where(eq(contactRepliesTable.messageId, req.params.id))
      .orderBy(contactRepliesTable.createdAt);

    res.json({ message, replies });
  },
);

router.post(
  "/support/messages/:id/reply",
  requireAuth,
  requireRoles([...supportRoles]),
  async (req, res) => {
    const parsed = replySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid reply.", errors: parsed.error.flatten() });
      return;
    }

    const [message] = await db
      .select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, req.params.id))
      .limit(1);

    if (!message) {
      res.status(404).json({ message: "Contact message not found." });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    let emailResult = { sent: false, skippedReason: "Email not attempted." as string | null };

    try {
      emailResult = await sendSupportReplyEmail({
        to: message.email,
        subject: `Re: ${message.subject}`,
        body: parsed.data.body,
      });
    } catch (error) {
      emailResult = {
        sent: false,
        skippedReason: error instanceof Error ? error.message : "Email failed.",
      };
    }

    const [reply] = await db
      .insert(contactRepliesTable)
      .values({
        messageId: message.id,
        authorId: user.id,
        authorName: user.name,
        body: parsed.data.body,
        emailSent: emailResult.sent,
        emailSkippedReason: emailResult.skippedReason,
      })
      .returning();

    await db
      .update(contactMessagesTable)
      .set({ status: "REPLIED", updatedAt: new Date() })
      .where(eq(contactMessagesTable.id, message.id));

    res.status(201).json({ reply, email: emailResult });
  },
);

router.patch(
  "/support/messages/:id/status",
  requireAuth,
  requireRoles([...supportRoles]),
  async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid status.", errors: parsed.error.flatten() });
      return;
    }

    const [message] = await db
      .update(contactMessagesTable)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(contactMessagesTable.id, req.params.id))
      .returning();

    if (!message) {
      res.status(404).json({ message: "Contact message not found." });
      return;
    }

    res.json({ message });
  },
);

export default router;
