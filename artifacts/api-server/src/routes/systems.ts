import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  systemsTable,
  systemStatusSchema,
  type UserRole,
} from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { requireAuth, requireRoles } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

const systemSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10),
  features: z.union([z.array(z.string()), z.string()]).optional(),
  startingPrice: z.string().trim().max(120).optional().nullable(),
  imageUrl: z.string().trim().max(1000).optional().nullable(),
  status: systemStatusSchema.optional(),
  featured: z.boolean().optional(),
});

const systemUpdateSchema = systemSchema.partial();

function normalizeFeatures(features?: string[] | string) {
  if (!features) return [];
  if (Array.isArray(features)) return features.map((feature) => feature.trim()).filter(Boolean);

  return features
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean);
}

router.get("/systems", async (req, res) => {
  const featured = req.query.featured === "true";
  const where = featured
    ? and(eq(systemsTable.status, "PUBLISHED"), eq(systemsTable.featured, true))
    : eq(systemsTable.status, "PUBLISHED");

  const systems = await db
    .select()
    .from(systemsTable)
    .where(where)
    .orderBy(desc(systemsTable.createdAt));

  res.json({ systems });
});

router.get("/systems/:slug", async (req, res) => {
  const slug = getRouteParam(req.params.slug);
  if (!slug) {
    res.status(404).json({ message: "System not found." });
    return;
  }

  const [system] = await db
    .select()
    .from(systemsTable)
    .where(and(eq(systemsTable.slug, slug), eq(systemsTable.status, "PUBLISHED")))
    .limit(1);

  if (!system) {
    res.status(404).json({ message: "System not found." });
    return;
  }

  res.json({ system });
});

router.get(
  "/admin/systems",
  requireAuth,
  requireRoles(adminRoles),
  async (_req, res) => {
    const systems = await db
      .select()
      .from(systemsTable)
      .orderBy(desc(systemsTable.createdAt));

    res.json({ systems });
  },
);

router.post(
  "/admin/systems",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const parsed = systemSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid system.", errors: parsed.error.flatten() });
      return;
    }

    const [system] = await db
      .insert(systemsTable)
      .values({
        ...parsed.data,
        features: normalizeFeatures(parsed.data.features),
      })
      .returning();

    res.status(201).json({ system });
  },
);

router.patch(
  "/admin/systems/:id",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const systemId = getRouteParam(req.params.id);
    if (!systemId) {
      res.status(404).json({ message: "System not found." });
      return;
    }

    const parsed = systemUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid system update.", errors: parsed.error.flatten() });
      return;
    }

    const { features, ...systemFields } = parsed.data;
    const update: Partial<typeof systemsTable.$inferInsert> = {
      ...systemFields,
      updatedAt: new Date(),
    };

    if ("features" in req.body) {
      update.features = normalizeFeatures(features);
    }

    const [system] = await db
      .update(systemsTable)
      .set(update)
      .where(eq(systemsTable.id, systemId))
      .returning();

    if (!system) {
      res.status(404).json({ message: "System not found." });
      return;
    }

    res.json({ system });
  },
);

router.delete(
  "/admin/systems/:id",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const systemId = getRouteParam(req.params.id);
    if (!systemId) {
      res.status(404).json({ message: "System not found." });
      return;
    }

    const [system] = await db
      .delete(systemsTable)
      .where(eq(systemsTable.id, systemId))
      .returning();

    if (!system) {
      res.status(404).json({ message: "System not found." });
      return;
    }

    res.json({ system });
  },
);

export default router;
