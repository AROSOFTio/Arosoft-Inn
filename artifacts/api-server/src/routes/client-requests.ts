import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  clientRequestServiceTypeSchema,
  clientRequestsTable,
  db,
} from "@workspace/db";
import { analyzeClientRequest } from "../lib/ai";
import { getRouteParam } from "../lib/params";
import { createUpload, fileToUrl } from "../lib/uploads";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();
const upload = createUpload("requirements");

const requestSchema = z.object({
  serviceType: clientRequestServiceTypeSchema,
  title: z.string().trim().min(2).max(220),
  description: z.string().trim().min(10),
  budgetRange: z.string().trim().max(120).optional().nullable(),
  expectedTimeline: z.string().trim().max(120).optional().nullable(),
});

router.post(
  "/client/requests",
  requireAuth,
  requireRoles(["CLIENT"]),
  upload.single("attachment"),
  async (req, res) => {
    const parsed = requestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid client request.", errors: parsed.error.flatten() });
      return;
    }

    const analysis = analyzeClientRequest(parsed.data);
    const user = (req as AuthenticatedRequest).user;

    const [request] = await db
      .insert(clientRequestsTable)
      .values({
        clientId: user.id,
        ...parsed.data,
        attachmentUrl: fileToUrl(req.file),
        aiSummary: analysis.summary,
        aiSuggestedPriceRange: analysis.suggestedPriceRange,
        aiMissingQuestions: analysis.missingQuestions,
        aiSuggestedTimeline: analysis.suggestedTimeline,
        aiSuggestedTaskCategories: analysis.suggestedTaskCategories,
        status: "AI_REVIEWED",
      })
      .returning();

    res.status(201).json({ request });
  },
);

router.get(
  "/client/requests",
  requireAuth,
  requireRoles(["CLIENT"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const requests = await db
      .select()
      .from(clientRequestsTable)
      .where(eq(clientRequestsTable.clientId, user.id))
      .orderBy(desc(clientRequestsTable.createdAt));

    res.json({ requests });
  },
);

router.get(
  "/client/requests/:id",
  requireAuth,
  requireRoles(["CLIENT"]),
  async (req, res) => {
    const requestId = getRouteParam(req.params.id);
    if (!requestId) {
      res.status(404).json({ message: "Client request not found." });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [request] = await db
      .select()
      .from(clientRequestsTable)
      .where(eq(clientRequestsTable.id, requestId))
      .limit(1);

    if (!request || request.clientId !== user.id) {
      res.status(404).json({ message: "Client request not found." });
      return;
    }

    res.json({ request });
  },
);

export default router;
