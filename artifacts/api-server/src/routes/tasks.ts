import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  db,
  projectsTable,
  taskCommentsTable,
  tasksTable,
  taskStatusSchema,
  type UserRole,
} from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
const staffRoles: UserRole[] = [
  "SUPPORT",
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "FULLSTACK_DEVELOPER",
  "MARKETING",
  "VIDEO_EDITOR",
  "FINANCE",
  "COMPLIANCE",
];
const internalRoles: UserRole[] = [...adminRoles, ...staffRoles];

const statusSchema = z.object({
  status: taskStatusSchema,
});
const commentSchema = z.object({
  body: z.string().trim().min(2),
});

function canAccessTask(user: { id: string; role: UserRole }, task: { assignedToId: string }) {
  return adminRoles.includes(user.role) || task.assignedToId === user.id;
}

router.get(
  "/staff/tasks",
  requireAuth,
  requireRoles(staffRoles),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.assignedToId, user.id))
      .orderBy(desc(tasksTable.createdAt));

    res.json({ tasks });
  },
);

router.get(
  "/tasks/:id",
  requireAuth,
  requireRoles(internalRoles),
  async (req, res) => {
    const taskId = getRouteParam(req.params.id);
    if (!taskId) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId))
      .limit(1);

    if (!task || !canAccessTask(user, task)) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, task.projectId))
      .limit(1);
    const comments = await db
      .select()
      .from(taskCommentsTable)
      .where(eq(taskCommentsTable.taskId, task.id))
      .orderBy(taskCommentsTable.createdAt);

    res.json({ task, project, comments });
  },
);

router.patch(
  "/tasks/:id/status",
  requireAuth,
  requireRoles(internalRoles),
  async (req, res) => {
    const taskId = getRouteParam(req.params.id);
    if (!taskId) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const parsed = statusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid task status.", errors: parsed.error.flatten() });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [existingTask] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId))
      .limit(1);

    if (!existingTask || !canAccessTask(user, existingTask)) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const [task] = await db
      .update(tasksTable)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(tasksTable.id, existingTask.id))
      .returning();

    res.json({ task });
  },
);

router.post(
  "/tasks/:id/comments",
  requireAuth,
  requireRoles(internalRoles),
  async (req, res) => {
    const taskId = getRouteParam(req.params.id);
    if (!taskId) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const parsed = commentSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid comment.", errors: parsed.error.flatten() });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId))
      .limit(1);

    if (!task || !canAccessTask(user, task)) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const [comment] = await db
      .insert(taskCommentsTable)
      .values({
        taskId: task.id,
        authorId: user.id,
        authorName: user.name,
        body: parsed.data.body,
      })
      .returning();

    res.status(201).json({ comment });
  },
);

export default router;
