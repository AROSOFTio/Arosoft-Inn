import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  clientRequestsTable,
  db,
  projectStatusSchema,
  projectsTable,
  tasksTable,
  usersTable,
  type UserRole,
} from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { audit } from "../lib/audit";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

const projectSchema = z.object({
  clientId: z.uuid(),
  clientRequestId: z.uuid().optional().nullable(),
  title: z.string().trim().min(2).max(220),
  description: z.string().trim().min(5),
  status: projectStatusSchema.optional(),
  budget: z.string().trim().max(120).optional().nullable(),
  deadline: z.string().trim().optional().nullable(),
});

const projectUpdateSchema = projectSchema.partial().extend({
  status: projectStatusSchema.optional(),
});

function parseOptionalDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

router.post(
  "/admin/projects",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const parsed = projectSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid project.", errors: parsed.error.flatten() });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [project] = await db
      .insert(projectsTable)
      .values({
        ...parsed.data,
        deadline: parseOptionalDate(parsed.data.deadline),
      })
      .returning();

    audit("project.created", { actorId: user.id, projectId: project.id, clientId: project.clientId });
    res.status(201).json({ project });
  },
);

router.get(
  "/admin/projects",
  requireAuth,
  requireRoles(adminRoles),
  async (_req, res) => {
    const projects = await db
      .select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.createdAt));

    res.json({ projects });
  },
);

router.get(
  "/admin/projects/:id",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const projectId = getRouteParam(req.params.id);
    if (!projectId) {
      res.status(404).json({ message: "Project not found." });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .limit(1);

    if (!project) {
      res.status(404).json({ message: "Project not found." });
      return;
    }

    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.projectId, project.id))
      .orderBy(desc(tasksTable.createdAt));

    res.json({ project, tasks });
  },
);

router.patch(
  "/admin/projects/:id",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const projectId = getRouteParam(req.params.id);
    if (!projectId) {
      res.status(404).json({ message: "Project not found." });
      return;
    }

    const parsed = projectUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: "Invalid project update.", errors: parsed.error.flatten() });
      return;
    }

    const { deadline, ...projectFields } = parsed.data;
    const update: Partial<typeof projectsTable.$inferInsert> = {
      ...projectFields,
      updatedAt: new Date(),
    };

    if ("deadline" in req.body) {
      update.deadline = parseOptionalDate(deadline);
    }

    const [project] = await db
      .update(projectsTable)
      .set(update)
      .where(eq(projectsTable.id, projectId))
      .returning();

    if (!project) {
      res.status(404).json({ message: "Project not found." });
      return;
    }

    audit("project.updated", { actorId: user.id, projectId: project.id, status: project.status });
    res.json({ project });
  },
);

router.post(
  "/admin/requests/:id/convert-to-project",
  requireAuth,
  requireRoles(adminRoles),
  async (req, res) => {
    const requestId = getRouteParam(req.params.id);
    if (!requestId) {
      res.status(404).json({ message: "Client request not found." });
      return;
    }

    const [request] = await db
      .select()
      .from(clientRequestsTable)
      .where(eq(clientRequestsTable.id, requestId))
      .limit(1);

    if (!request) {
      res.status(404).json({ message: "Client request not found." });
      return;
    }

    const user = (req as AuthenticatedRequest).user;
    const [project] = await db
      .insert(projectsTable)
      .values({
        clientId: request.clientId,
        clientRequestId: request.id,
        title: request.title,
        description: request.description,
        budget: request.budgetRange,
        status: "PLANNING",
      })
      .returning();

    await db
      .update(clientRequestsTable)
      .set({
        status: "CONVERTED_TO_PROJECT",
        convertedProjectId: project.id,
        updatedAt: new Date(),
      })
      .where(eq(clientRequestsTable.id, request.id));

    audit("client_request.converted_to_project", { actorId: user.id, requestId: request.id, projectId: project.id });
    res.status(201).json({ project, projectId: project.id });
  },
);

router.get(
  "/admin/staff",
  requireAuth,
  requireRoles(adminRoles),
  async (_req, res) => {
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
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        isActive: usersTable.isActive,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(usersTable.name);
    res.json({ users: users.filter((user) => staffRoles.includes(user.role)) });
  },
);

router.get(
  "/admin/clients",
  requireAuth,
  requireRoles(adminRoles),
  async (_req, res) => {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        isActive: usersTable.isActive,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(usersTable.name);
    res.json({ users: users.filter((user) => user.role === "CLIENT") });
  },
);

export default router;
