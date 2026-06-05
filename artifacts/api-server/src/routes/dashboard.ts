import { Router, type IRouter } from "express";
import { and, count, eq, inArray, ne } from "drizzle-orm";
import {
  clientRequestsTable,
  contactMessagesTable,
  coursesTable,
  db,
  learningTasksTable,
  paymentRequestsTable,
  portfolioItemsTable,
  projectsTable,
  scriptTemplatesTable,
  studentEnrollmentsTable,
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
      publishedCourses,
      studentEnrollments,
      publishedPortfolio,
      pendingPayments,
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
      db
        .select({ value: count() })
        .from(coursesTable)
        .where(eq(coursesTable.status, "PUBLISHED"))
        .then(([row]) => row?.value ?? 0),
      tableCount(studentEnrollmentsTable),
      db
        .select({ value: count() })
        .from(portfolioItemsTable)
        .where(eq(portfolioItemsTable.status, "PUBLISHED"))
        .then(([row]) => row?.value ?? 0),
      db
        .select({ value: count() })
        .from(paymentRequestsTable)
        .where(eq(paymentRequestsTable.status, "PENDING_PAYMENT"))
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
        { label: "Published courses", value: String(publishedCourses), detail: "Visible on the public Academy page" },
        { label: "Student enrollments", value: String(studentEnrollments), detail: "Course enrollments across students" },
        { label: "Portfolio items", value: String(publishedPortfolio), detail: "Published public portfolio work" },
        { label: "Pending payments", value: String(pendingPayments), detail: "Payment requests awaiting finance action" },
      ],
      activity: [
        `${totalRequests} client requests in the platform`,
        `${activeProjects} active projects in progress`,
        `${studentEnrollments} student enrollments recorded`,
        `${publishedPortfolio} portfolio items published`,
        `${openSupport} support conversations need attention`,
        `${pendingPayments} payment requests pending`,
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
        { label: "Pending payments", value: "0", detail: "Payment requests are handled by finance after submission" },
        { label: "Support threads", value: "0", detail: "Use Contact to start a support conversation" },
      ],
      activity: [
        `${openRequests} active requests on your account`,
        `${activeProjects} projects currently visible`,
        "Payment requests will be confirmed by finance",
      ],
    });
  },
);

router.get(
  "/dashboard/student",
  requireAuth,
  requireRoles(["STUDENT"]),
  async (req, res) => {
    const user = (req as AuthenticatedRequest).user;
    const [publishedCourses, enrollments, pendingTasks] = await Promise.all([
      db
        .select({ value: count() })
        .from(coursesTable)
        .where(eq(coursesTable.status, "PUBLISHED"))
        .then(([row]) => row?.value ?? 0),
      db
        .select()
        .from(studentEnrollmentsTable)
        .where(eq(studentEnrollmentsTable.studentId, user.id)),
      db
        .select({ value: count() })
        .from(learningTasksTable)
        .where(and(eq(learningTasksTable.studentId, user.id), inArray(learningTasksTable.status, ["TODO", "IN_PROGRESS"])))
        .then(([row]) => row?.value ?? 0),
    ]);
    const averageProgress = enrollments.length
      ? Math.round(enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) / enrollments.length)
      : 0;

    res.json({
      stats: [
        { label: "Published courses", value: String(publishedCourses), detail: "Courses available in the public academy" },
        { label: "My enrollments", value: String(enrollments.length), detail: "Courses connected to your student account" },
        { label: "Learning tasks", value: String(pendingTasks), detail: "Pending assignments and learning tasks" },
        { label: "Progress score", value: `${averageProgress}%`, detail: "Average completion across enrolled courses" },
      ],
      activity: [
        `${enrollments.length} courses enrolled`,
        `${pendingTasks} pending learning tasks`,
        `${averageProgress}% average progress`,
      ],
    });
  },
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
    const [assignedTasks, pendingPayments, paidPayments] = await Promise.all([
      countAssignedOpenTasks(user.id),
      db
        .select({ value: count() })
        .from(paymentRequestsTable)
        .where(eq(paymentRequestsTable.status, "PENDING_PAYMENT"))
        .then(([row]) => row?.value ?? 0),
      db
        .select({ value: count() })
        .from(paymentRequestsTable)
        .where(eq(paymentRequestsTable.status, "PAID"))
        .then(([row]) => row?.value ?? 0),
    ]);
    res.json({ stats: [
      { label: "Finance tasks", value: String(assignedTasks), detail: "Open tasks assigned to you" },
      { label: "Pending payments", value: String(pendingPayments), detail: "Payment requests awaiting confirmation" },
      { label: "Paid requests", value: String(paidPayments), detail: "Requests marked as paid" },
      { label: "Receipts", value: "0", detail: "Receipt records are reserved for gateway integration" },
    ], activity: [`${assignedTasks} open finance tasks assigned to you`, `${pendingPayments} payment requests pending`] });
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
