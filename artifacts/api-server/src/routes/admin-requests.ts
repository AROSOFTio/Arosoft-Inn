import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  clientRequestStatusSchema,
  clientRequestsTable,
  db,
} from "@workspace/db";
import { requireAuth, requireRoles } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles = ["SUPER_ADMIN", "ADMIN"] as const;

const statusSchema = z.object({
  status: clientRequestStatusSchema,
});

router.get(
  "/admin/requests",
  requireAuth,
  requireRoles([...adminRoles]),
  async (_req, res) => {
    const requests = await db
      .select()
      .from(clientRequestsTable)
      .orderBy(desc(clientRequestsTable.createdAt));

    res.json({ requests });
  },
);

router.get(
  "/admin/requests/:id",
  requireAuth,
  requireRoles([...adminRoles]),
  async (req, res) => {
    const [request] = await db
      .select()
      .from(clientRequestsTable)
      .where(eq(clientRequestsTable.id, req.params.id))
      .limit(1);

    if (!request) {
      res.status(404).json({ message: "Client request not found." });
      return;
    }

    res.json({ request });
  },
);

router.patch(
  "/admin/requests/:id/status",
  requireAuth,
  requireRoles([...adminRoles]),
  async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid request status.", errors: parsed.error.flatten() });
      return;
    }

    const [request] = await db
      .update(clientRequestsTable)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(clientRequestsTable.id, req.params.id))
      .returning();

    if (!request) {
      res.status(404).json({ message: "Client request not found." });
      return;
    }

    res.json({ request });
  },
);

router.post(
  "/admin/requests/:id/convert-to-project",
  requireAuth,
  requireRoles([...adminRoles]),
  async (req, res) => {
    const [request] = await db
      .update(clientRequestsTable)
      .set({
        status: "CONVERTED_TO_PROJECT",
        convertedProjectId: randomUUID(),
        updatedAt: new Date(),
      })
      .where(eq(clientRequestsTable.id, req.params.id))
      .returning();

    if (!request) {
      res.status(404).json({ message: "Client request not found." });
      return;
    }

    res.json({ request, projectId: request.convertedProjectId });
  },
);

export default router;
