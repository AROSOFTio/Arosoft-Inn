import { Router, type IRouter } from "express";
import { and, count, eq, inArray, ne } from "drizzle-orm";
import {
  clientRequestsTable,
  contactMessagesTable,
  db,
  projectsTable,
  scriptTemplatesTable,
  systemsTable,
  tasksTable,
  type ClientRequestStatus,
  type ContactStatus,
} from "@workspace/db";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

async function tableCount(table: any) {
  const [row] = await db.select({ value: count() }).from(table);
  return row?.value ?? 0;
}

async function countClientRequestsByStatus(status: ClientRequestStatus) {
  const [row] = await db
    .select({ value: count() })
    .from(clientRequestsTable)
    .where(eq(clientRequestsTable.status, status));
  return row?.value ?? 0;
}

async function countOpenTasks() {
  const [row] = await db
    .select({ value: count() })
    .from(tasksTable)
    .where(ne(tasksTable.status, "COMPLETED"));
  return row?.value ?? 0;
}

async function countAssignedOpenTasks(userId: string) {
  const [row] = await db
    .select({ value: count() })
    .from(tasksTable)
    .where(and(eq(tasksTable.assignedToId, userId), ne(tasksTable.status, "COMPLETED")));
  return row?.value ?? 0;
}

async function countSupportMessages(statuses: ContactStatus[]) {
  const [row] = await db
    .select({ value: count() })
    .from(contactMessagesTable)
    .where(inArray(contactMessagesTable.status, statuses));
  return row?.value ?? 0;
}

router.get(
  "/dashboard/admin",
  requireAuth,
  requireRoles(["SUPER_ADMIN", "ADMIN"]),
  async (_req, res) => {
    const [
      totalRequests,
      submittedRequests,
      activeProjects,
      pendingTasks,
      openSupport,
      publishedSystems,
      publishedScripts,
    ] = await Promise.all([
      tableCount(clientRequestsTable),
      countClientRequestsByStatus("SUBMITTED"),
      db
        .select({ value: count() })
        .from(projectsTable)
        .where(inArray(projectsTable.status, ["PLANNING", "ASSIGNED", "IN_PROGRESS", "REVIEW", "MAINTENANCE"]))
        .then(([row]) => row?.value ?? 0),
      countOpenTasks(),
      countSupportMessages(["NEW", "OPEN"]),
      db
        .select({ value: count() })
        .from(systemsTable)
        .where(eq(systemsTable.status, "PUBLISHED"))
        .then(([row]) => row?.value ?? 0),
      db
        .select({ value: count() })
        .from(scriptTemplatesTable)
        .where(eq(scriptTemplatesTable.status, "PUBLISHED"))
        .then(([row]) => row?.value ?? 0),
    ]);

    res.json({
      stats: [
        { label: "Total client requests", value: String(totalRequests), detail: `${submittedRequests} submitted requests need review` },
        { label: "Active projects", value: String(activeProjects), detail: "Projects currently in delivery or review" },
        { label: "Pending tasks", value: String(pendingTasks), detail: "Open staff tasks across all projects" },
        { label: "Open support tickets", value: String(openSupport), detail: "New or open contact messages" },
        { label: "Published systems", value: String(publishedSystems), detail: "Visible on the public Systems page" },
        { label: "Published scripts", value: String(publishedScripts), detail: "Visible on the public Scripts page" },
      ],
      activity: [
        `${totalRequests} client requests in the platform`,
        `${activeProjects} active projects in progress`,
        `${openSupport} support conversations need attention`,
      ],
    });
  },
);

router.get(
  "/dashboard/support",
  requireAuth,
  requireRoles(["SUPPORT"]),
  async (_req, res) => {
    const [inboxMessages, openTickets, pendingReplies, closedMessages] = await Promise.all([
      tableCount(contactMessagesTable),
      countSupportMessages(["NEW", "OPEN"]),
      countSupportMessages(["OPEN"]),
      countSupportMessages(["CLOSED"]),
    ]);

    res.json({
      stats: [
        { label: "Inbox messages", value: String(inboxMessages), detail: "Total contact messages received" },
        { label: "Open tickets", value: String(openTickets), detail: "New or open support conversations" },
        { label: "Pending replies", value: String(pendingReplies), detail: "Open messages waiting for a reply" },
        { label: "Closed messages", value: String(closedMessages), detail: "Resolved support conversations" },
      ],
      activity: [
        `${openTickets} open support conversations`,
        `${pendingReplies} conversations waiting for replies`,
        `${closedMessages} conversations closed`,
      ],
    });
  },
);

router.get(
  "/dashboard/client",
  requireAuth,
  requireRoles(["CLIENT"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const [openRequests, activeProjects] = await Promise.all([
      db
        .select({ value: count() })
        .from(clientRequestsTable)
        .where(and(eq(clientRequestsTable.clientId, user.id), ne(clientRequestsTable.status, "CONVERTED_TO_PROJECT")))
        .then(([row]) => row?.value ?? 0),
      db
        .select({ value: count() })
        .from(projectsTable)
        .where(and(eq(projectsTable.clientId, user.id), ne(projectsTable.status, "COMPLETED")))
        .then(([row]) => row?.value ?? 0),
    ]);

    res.json({
      stats: [
        { label: "Open requests", value: String(openRequests), detail: "Requests submitted for review or delivery" },
        { label: "Active projects", value: String(activeProjects), detail: "Projects currently connected to your account" },
        { label: "Pending invoices", value: "0", detail: "Invoices are reserved for the finance sprint" },
        { label: "Support threads", value: "0", detail: "Use Contact to start a support conversation" },
      ],
      activity: [
        `${openRequests} active requests on your account`,
        `${activeProjects} projects currently visible`,
        "Invoices will appear after the finance sprint",
      ],
    });
  },
);

router.get(
  "/dashboard/student",
  requireAuth,
  requireRoles(["STUDENT"]),
  (_req, res) => res.json({
    stats: [
      { label: "Courses", value: "0", detail: "Course management is reserved for a later sprint" },
      { label: "Learning tasks", value: "0", detail: "Student coursework will appear after courses are built" },
      { label: "Progress", value: "0%", detail: "Progress tracking is not active yet" },
      { label: "AI support", value: "0", detail: "AI support is reserved for a later sprint" },
    ],
    activity: ["Student course features are not implemented yet"],
  }),
);

router.get(
  "/dashboard/developer",
  requireAuth,
  requireRoles(["FRONTEND_DEVELOPER", "BACKEND_DEVELOPER", "FULLSTACK_DEVELOPER"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const assignedTasks = await countAssignedOpenTasks(user.id);
    res.json({
      stats: [
        { label: "Assigned tasks", value: String(assignedTasks), detail: "Open tasks assigned to you" },
        { label: "Project files", value: "0", detail: "File management is reserved for a later sprint" },
        { label: "Comments", value: "0", detail: "Task comments appear inside assigned tasks" },
        { label: "Status updates", value: String(assignedTasks), detail: "Update progress from task details" },
      ],
      activity: [`${assignedTasks} open tasks assigned to you`],
    });
  },
);

router.get(
  "/dashboard/marketing",
  requireAuth,
  requireRoles(["MARKETING"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const assignedTasks = await countAssignedOpenTasks(user.id);
    res.json({ stats: [
      { label: "Marketing tasks", value: String(assignedTasks), detail: "Open tasks assigned to you" },
      { label: "Campaigns", value: "0", detail: "Campaign records are reserved for a later sprint" },
      { label: "Content plans", value: "0", detail: "Content planning is reserved for a later sprint" },
      { label: "Reviews", value: "0", detail: "Review workflow is not active yet" },
    ], activity: [`${assignedTasks} open marketing tasks assigned to you`] });
  },
);

router.get(
  "/dashboard/video",
  requireAuth,
  requireRoles(["VIDEO_EDITOR"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const assignedTasks = await countAssignedOpenTasks(user.id);
    res.json({ stats: [
      { label: "Video tasks", value: String(assignedTasks), detail: "Open tasks assigned to you" },
      { label: "Uploads", value: "0", detail: "Upload management is reserved for a later sprint" },
      { label: "Revisions", value: "0", detail: "Revision tracking will use task comments" },
      { label: "Completed edits", value: "0", detail: "Completed task reporting is not active yet" },
    ], activity: [`${assignedTasks} open video tasks assigned to you`] });
  },
);

router.get(
  "/dashboard/finance",
  requireAuth,
  requireRoles(["FINANCE"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const assignedTasks = await countAssignedOpenTasks(user.id);
    res.json({ stats: [
      { label: "Finance tasks", value: String(assignedTasks), detail: "Open tasks assigned to you" },
      { label: "Invoices", value: "0", detail: "Invoice records are reserved for a later sprint" },
      { label: "Payments", value: "0", detail: "Payment tracking is not active yet" },
      { label: "Receipts", value: "0", detail: "Receipt records are reserved for a later sprint" },
    ], activity: [`${assignedTasks} open finance tasks assigned to you`] });
  },
);

router.get(
  "/dashboard/compliance",
  requireAuth,
  requireRoles(["COMPLIANCE"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const assignedTasks = await countAssignedOpenTasks(user.id);
    res.json({ stats: [
      { label: "Compliance tasks", value: String(assignedTasks), detail: "Open tasks assigned to you" },
      { label: "Tax records", value: "0", detail: "Tax records are reserved for a later sprint" },
      { label: "Contracts", value: "0", detail: "Contract records are reserved for a later sprint" },
      { label: "Audit logs", value: "0", detail: "Audit logging is not active yet" },
    ], activity: [`${assignedTasks} open compliance tasks assigned to you`] });
  },
);

export default router;
