import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  portfolioItemsTable,
  portfolioStatusSchema,
  type UserRole,
} from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { createUpload, fileToUrl } from "../lib/uploads";
import { requireAuth, requireRoles } from "../middleware/auth";

const router: IRouter = Router();
const upload = createUpload("portfolio");
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
const formBooleanSchema = z.preprocess((value) => value === true || value === "true" || value === "on" || value === "1", z.boolean());

const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(220),
  projectType: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10),
  clientName: z.string().trim().max(180).optional().nullable(),
  liveUrl: z.string().trim().max(1000).optional().nullable(),
  githubUrl: z.string().trim().max(1000).optional().nullable(),
  imageUrls: z.union([z.array(z.string()), z.string()]).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  status: portfolioStatusSchema.optional(),
  featured: formBooleanSchema.optional(),
});

const portfolioUpdateSchema = portfolioSchema.partial();

function normalizeList(value?: string[] | string | null) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);

  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uploadedUrls(files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }) {
  if (!files) return [];
  const list = Array.isArray(files) ? files : Object.values(files).flat();
  return list.map((file) => fileToUrl(file)).filter((url): url is string => Boolean(url));
}

router.get("/portfolio", async (req, res) => {
  const featured = req.query.featured === "true";
  const where = featured
    ? and(eq(portfolioItemsTable.status, "PUBLISHED"), eq(portfolioItemsTable.featured, true))
    : eq(portfolioItemsTable.status, "PUBLISHED");

  const items = await db
    .select()
    .from(portfolioItemsTable)
    .where(where)
    .orderBy(desc(portfolioItemsTable.createdAt));

  res.json({ items });
});

router.get("/portfolio/:id", async (req, res) => {
  const itemId = getRouteParam(req.params.id);
  if (!itemId) {
    res.status(404).json({ message: "Portfolio item not found." });
    return;
  }

  const [item] = await db
    .select()
    .from(portfolioItemsTable)
    .where(and(eq(portfolioItemsTable.id, itemId), eq(portfolioItemsTable.status, "PUBLISHED")))
    .limit(1);

  if (!item) {
    res.status(404).json({ message: "Portfolio item not found." });
    return;
  }

  res.json({ item });
});

router.get("/admin/portfolio", requireAuth, requireRoles(adminRoles), async (_req, res) => {
  const items = await db.select().from(portfolioItemsTable).orderBy(desc(portfolioItemsTable.createdAt));
  res.json({ items });
});

router.post("/admin/portfolio", requireAuth, requireRoles(adminRoles), upload.array("images", 8), async (req, res) => {
  const parsed = portfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid portfolio item.", errors: parsed.error.flatten() });
    return;
  }

  const [item] = await db
    .insert(portfolioItemsTable)
    .values({
      ...parsed.data,
      imageUrls: [...normalizeList(parsed.data.imageUrls), ...uploadedUrls(req.files)],
      tags: normalizeList(parsed.data.tags),
    })
    .returning();

  res.status(201).json({ item });
});

router.patch("/admin/portfolio/:id", requireAuth, requireRoles(adminRoles), upload.array("images", 8), async (req, res) => {
  const itemId = getRouteParam(req.params.id);
  if (!itemId) {
    res.status(404).json({ message: "Portfolio item not found." });
    return;
  }

  const parsed = portfolioUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid portfolio item update.", errors: parsed.error.flatten() });
    return;
  }

  const { imageUrls, tags, ...fields } = parsed.data;
  const update: Partial<typeof portfolioItemsTable.$inferInsert> = {
    ...fields,
    updatedAt: new Date(),
  };

  if ("imageUrls" in req.body || uploadedUrls(req.files).length) {
    update.imageUrls = [...normalizeList(imageUrls), ...uploadedUrls(req.files)];
  }

  if ("tags" in req.body) {
    update.tags = normalizeList(tags);
  }

  const [item] = await db.update(portfolioItemsTable).set(update).where(eq(portfolioItemsTable.id, itemId)).returning();
  if (!item) {
    res.status(404).json({ message: "Portfolio item not found." });
    return;
  }

  res.json({ item });
});

router.delete("/admin/portfolio/:id", requireAuth, requireRoles(adminRoles), async (req, res) => {
  const itemId = getRouteParam(req.params.id);
  if (!itemId) {
    res.status(404).json({ message: "Portfolio item not found." });
    return;
  }

  const [item] = await db.delete(portfolioItemsTable).where(eq(portfolioItemsTable.id, itemId)).returning();
  if (!item) {
    res.status(404).json({ message: "Portfolio item not found." });
    return;
  }

  res.json({ item });
});

export default router;
