import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, projectsTable, tasksTable } from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get(
  "/client/projects",
  requireAuth,
  requireRoles(["CLIENT"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.clientId, user.id))
      .orderBy(desc(projectsTable.createdAt));

    res.json({ projects });
  },
);

router.get(
  "/client/projects/:id",
  requireAuth,
  requireRoles(["CLIENT"]),
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

    if (!project || project.clientId !== user.id) {
      res.status(404).json({ message: "Project not found." });
      return;
    }

    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.projectId, project.id))
      .orderBy(desc(tasksTable.updatedAt));

    res.json({ project, tasks });
  },
);

export default router;
