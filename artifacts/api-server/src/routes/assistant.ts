import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import {
  createSupportLeadFromChat,
  generateAssistantReply,
  searchKnowledge,
} from "../lib/knowledge";

const router: IRouter = Router();

const chatSchema = z.object({
  query: z.string().trim().min(2).max(2000),
  context: z.array(z.string()).optional(),
});

const leadSchema = z.object({
  fullName: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(255).optional(),
  phone: z.string().trim().max(80).optional(),
  subject: z.string().trim().max(240).optional(),
  message: z.string().trim().min(5).max(3000),
});

router.post("/assistant/chat", async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid assistant query.", errors: parsed.error.flatten() });
    return;
  }

  const context = [...searchKnowledge(parsed.data.query), ...(parsed.data.context ?? [])].slice(0, 8);
  const result = generateAssistantReply(parsed.data.query, context);

  res.json({
    ...result,
    context,
    mode: {
      cag: true,
      ragPlaceholder: true,
      cragPlaceholder: true,
      paidAiConnected: false,
    },
  });
});

router.post("/assistant/support-lead", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid support lead.", errors: parsed.error.flatten() });
    return;
  }

  const message = await createSupportLeadFromChat(parsed.data);
  res.status(201).json({ message });
});

export default router;
