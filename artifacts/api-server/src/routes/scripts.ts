import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  scriptTemplatesTable,
  scriptTemplateStatusSchema,
  type UserRole,
} from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { requireAuth, requireRoles } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

const scriptSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10),
  price: z.string().trim().min(1).max(80).default("$5"),
  previewUrl: z.string().trim().max(1000).optional().nullable(),
  downloadUrl: z.string().trim().max(1000).optional().nullable(),
  imageUrl: z.string().trim().max(1000).optional().nullable(),
  status: scriptTemplateStatusSchema.optional(),
  featured: z.boolean().optional(),
});

const scriptUpdateSchema = scriptSchema.partial();

router.get("/scripts", async (req, res) => {
  const featured = req.query.featured === "true";
  const where = featured
    ? and(eq(scriptTemplatesTable.status, "PUBLISHED"), eq(scriptTemplatesTable.featured, true))
    : eq(scriptTemplatesTable.status, "PUBLISHED");

  const scripts = await db
    .select()
    .from(scriptTemplatesTable)
    .where(where)
    .orderBy(desc(scriptTemplatesTable.createdAt));

  res.json({ scripts });
});

router.get("/scripts/:slug", async (req, res) => {
  const slug = getRouteParam(req.params.slug);
  if (!slug) {
    res.status(404).json({ message: "Script template not found." });
    return;
  }

  const [script] = await db
    .select()
    .from(scriptTemplatesTable)
    .where(and(eq(scriptTemplatesTable.slug, slug), eq(scriptTemplatesTable.status, "PUBLISHED")))
    .limit(1);

  if (!script) {
    res.status(404).json({ message: "Script template not found." });
    return;
  }

  res.json({ script });
});

router.get(
  "/admin/scripts",
  requireAuth,
  requireRoles(adminRoles),
  async (_req, res) => {
    const scripts = await db
      .select()
      .from(scriptTemplatesTable)
      .orderBy(desc(scriptTemplatesTable.createdAt));

    res.json({ scripts });
  },
);

router.post(
  "/admin/scripts",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const parsed = scriptSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid script template.", errors: parsed.error.flatten() });
      return;
    }

    const [script] = await db
      .insert(scriptTemplatesTable)
      .values(parsed.data)
      .returning();

    res.status(201).json({ script });
  },
);

router.patch(
  "/admin/scripts/:id",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const scriptId = getRouteParam(req.params.id);
    if (!scriptId) {
      res.status(404).json({ message: "Script template not found." });
      return;
    }

    const parsed = scriptUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid script template update.", errors: parsed.error.flatten() });
      return;
    }

    const [script] = await db
      .update(scriptTemplatesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(scriptTemplatesTable.id, scriptId))
      .returning();

    if (!script) {
      res.status(404).json({ message: "Script template not found." });
      return;
    }

    res.json({ script });
  },
);

router.delete(
  "/admin/scripts/:id",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const scriptId = getRouteParam(req.params.id);
    if (!scriptId) {
      res.status(404).json({ message: "Script template not found." });
      return;
    }

    const [script] = await db
      .delete(scriptTemplatesTable)
      .where(eq(scriptTemplatesTable.id, scriptId))
      .returning();

    if (!script) {
      res.status(404).json({ message: "Script template not found." });
      return;
    }

    res.json({ script });
  },
);

export default router;
