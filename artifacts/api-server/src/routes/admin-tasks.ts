import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  taskRoleCategorySchema,
  tasksTable,
  taskStatusSchema,
  type UserRole,
} from "@workspace/db";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

const taskSchema = z.object({
  projectId: z.uuid(),
  assignedToId: z.uuid(),
  title: z.string().trim().min(2).max(220),
  description: z.string().trim().min(5),
  roleCategory: taskRoleCategorySchema,
  priority: z.string().trim().min(1).max(40).default("Normal"),
  status: taskStatusSchema.optional(),
  dueDate: z.string().trim().optional().nullable(),
});

function parseOptionalDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

router.post(
  "/admin/tasks",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid task.", errors: parsed.error.flatten() });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [task] = await db
      .insert(tasksTable)
      .values({
        ...parsed.data,
        createdById: user.id,
        dueDate: parseOptionalDate(parsed.data.dueDate),
      })
      .returning();

    res.status(201).json({ task });
  },
);

router.get(
  "/admin/tasks",
  requireAuth,
  requireRoles(adminRoles),
  async (_req, res) => {
    const tasks = await db
      .select()
      .from(tasksTable)
      .orderBy(desc(tasksTable.createdAt));

    res.json({ tasks });
  },
);

export default router;
