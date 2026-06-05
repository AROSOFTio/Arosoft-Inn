import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const userRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "SUPPORT",
  "CLIENT",
  "STUDENT",
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "FULLSTACK_DEVELOPER",
  "MARKETING",
  "VIDEO_EDITOR",
  "FINANCE",
  "COMPLIANCE",
] as const;

export const userRoleEnum = pgEnum("user_role", userRoles);
export const userRoleSchema = z.enum(userRoles);
export type UserRole = z.infer<typeof userRoleSchema>;

export const contactStatuses = ["NEW", "OPEN", "REPLIED", "CLOSED"] as const;
export const contactStatusEnum = pgEnum("contact_status", contactStatuses);
export const contactStatusSchema = z.enum(contactStatuses);
export type ContactStatus = z.infer<typeof contactStatusSchema>;

export const clientRequestServiceTypes = [
  "WEBSITE",
  "WEB_SYSTEM",
  "MOBILE_APP",
  "SCRIPT_TEMPLATE",
  "ACADEMY_SUPPORT",
  "VIDEO_PRODUCTION",
  "DIGITAL_MARKETING",
  "BRANDING",
  "CONSULTATION",
  "OTHER",
] as const;
export const clientRequestServiceTypeEnum = pgEnum("client_request_service_type", clientRequestServiceTypes);
export const clientRequestServiceTypeSchema = z.enum(clientRequestServiceTypes);
export type ClientRequestServiceType = z.infer<typeof clientRequestServiceTypeSchema>;

export const clientRequestStatuses = [
  "DRAFT",
  "SUBMITTED",
  "AI_REVIEWED",
  "ADMIN_REVIEW",
  "QUOTED",
  "ACCEPTED",
  "REJECTED",
  "CONVERTED_TO_PROJECT",
] as const;
export const clientRequestStatusEnum = pgEnum("client_request_status", clientRequestStatuses);
export const clientRequestStatusSchema = z.enum(clientRequestStatuses);
export type ClientRequestStatus = z.infer<typeof clientRequestStatusSchema>;

export const projectStatuses = [
  "PLANNING",
  "ASSIGNED",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
  "MAINTENANCE",
] as const;
export const projectStatusEnum = pgEnum("project_status", projectStatuses);
export const projectStatusSchema = z.enum(projectStatuses);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const taskRoleCategories = [
  "FRONTEND",
  "BACKEND",
  "FULLSTACK",
  "UI_UX",
  "MARKETING",
  "VIDEO",
  "FINANCE",
  "SUPPORT",
  "COMPLIANCE",
  "QA",
] as const;
export const taskRoleCategoryEnum = pgEnum("task_role_category", taskRoleCategories);
export const taskRoleCategorySchema = z.enum(taskRoleCategories);
export type TaskRoleCategory = z.infer<typeof taskRoleCategorySchema>;

export const taskStatuses = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED", "BLOCKED"] as const;
export const taskStatusEnum = pgEnum("task_status", taskStatuses);
export const taskStatusSchema = z.enum(taskStatuses);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const systemStatuses = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export const systemStatusEnum = pgEnum("system_status", systemStatuses);
export const systemStatusSchema = z.enum(systemStatuses);
export type SystemStatus = z.infer<typeof systemStatusSchema>;

export const scriptTemplateStatuses = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export const scriptTemplateStatusEnum = pgEnum("script_template_status", scriptTemplateStatuses);
export const scriptTemplateStatusSchema = z.enum(scriptTemplateStatuses);
export type ScriptTemplateStatus = z.infer<typeof scriptTemplateStatusSchema>;

export const courseStatuses = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export const courseStatusEnum = pgEnum("course_status", courseStatuses);
export const courseStatusSchema = z.enum(courseStatuses);
export type CourseStatus = z.infer<typeof courseStatusSchema>;

export const enrollmentStatuses = ["ACTIVE", "COMPLETED", "CANCELLED"] as const;
export const enrollmentStatusEnum = pgEnum("enrollment_status", enrollmentStatuses);
export const enrollmentStatusSchema = z.enum(enrollmentStatuses);
export type EnrollmentStatus = z.infer<typeof enrollmentStatusSchema>;

export const quizStatuses = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export const quizStatusEnum = pgEnum("quiz_status", quizStatuses);
export const quizStatusSchema = z.enum(quizStatuses);
export type QuizStatus = z.infer<typeof quizStatusSchema>;

export const learningTaskStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"] as const;
export const learningTaskStatusEnum = pgEnum("learning_task_status", learningTaskStatuses);
export const learningTaskStatusSchema = z.enum(learningTaskStatuses);
export type LearningTaskStatus = z.infer<typeof learningTaskStatusSchema>;

export const portfolioStatuses = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export const portfolioStatusEnum = pgEnum("portfolio_status", portfolioStatuses);
export const portfolioStatusSchema = z.enum(portfolioStatuses);
export type PortfolioStatus = z.infer<typeof portfolioStatusSchema>;

export const paymentRequestStatuses = ["PENDING_PAYMENT", "PAID", "CANCELLED"] as const;
export const paymentRequestStatusEnum = pgEnum("payment_request_status", paymentRequestStatuses);
export const paymentRequestStatusSchema = z.enum(paymentRequestStatuses);
export type PaymentRequestStatus = z.infer<typeof paymentRequestStatusSchema>;

export const paymentMethods = ["MTN_MOMO", "AIRTEL_MONEY", "BANK_TRANSFER", "REQUEST_INVOICE"] as const;
export const paymentMethodEnum = pgEnum("payment_method", paymentMethods);
export const paymentMethodSchema = z.enum(paymentMethods);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const paymentRequestTypes = ["SCRIPT_TEMPLATE", "COURSE", "WEBSITE_PACKAGE", "SYSTEM_PACKAGE", "SUPPORT_PACKAGE", "ACADEMY_PACKAGE"] as const;
export const paymentRequestTypeEnum = pgEnum("payment_request_type", paymentRequestTypes);
export const paymentRequestTypeSchema = z.enum(paymentRequestTypes);
export type PaymentRequestType = z.infer<typeof paymentRequestTypeSchema>;

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull().default("CLIENT"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_unique").on(table.email),
  }),
);

export const contactMessagesTable = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 80 }),
  organization: varchar("organization", { length: 180 }),
  reason: varchar("reason", { length: 120 }).notNull(),
  priority: varchar("priority", { length: 40 }).notNull().default("Normal"),
  subject: varchar("subject", { length: 240 }).notNull(),
  message: text("message").notNull(),
  attachmentUrl: text("attachment_url"),
  status: contactStatusEnum("status").notNull().default("NEW"),
  source: varchar("source", { length: 80 }).notNull().default("PUBLIC_CONTACT_FORM"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactRepliesTable = pgTable("contact_replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  messageId: uuid("message_id").notNull().references(() => contactMessagesTable.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => usersTable.id, { onDelete: "set null" }),
  authorName: varchar("author_name", { length: 160 }).notNull(),
  body: text("body").notNull(),
  emailSent: boolean("email_sent").notNull().default(false),
  emailSkippedReason: text("email_skipped_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clientRequestsTable = pgTable("client_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  serviceType: clientRequestServiceTypeEnum("service_type").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  budgetRange: varchar("budget_range", { length: 120 }),
  expectedTimeline: varchar("expected_timeline", { length: 120 }),
  attachmentUrl: text("attachment_url"),
  aiSummary: text("ai_summary"),
  aiSuggestedPriceRange: varchar("ai_suggested_price_range", { length: 120 }),
  aiMissingQuestions: jsonb("ai_missing_questions").$type<string[]>().notNull().default([]),
  aiSuggestedTimeline: varchar("ai_suggested_timeline", { length: 120 }),
  aiSuggestedTaskCategories: jsonb("ai_suggested_task_categories").$type<string[]>().notNull().default([]),
  status: clientRequestStatusEnum("status").notNull().default("SUBMITTED"),
  convertedProjectId: uuid("converted_project_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectsTable = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  clientRequestId: uuid("client_request_id").references(() => clientRequestsTable.id, { onDelete: "set null" }),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  status: projectStatusEnum("status").notNull().default("PLANNING"),
  budget: varchar("budget", { length: 120 }),
  deadline: timestamp("deadline", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tasksTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
  assignedToId: uuid("assigned_to_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdById: uuid("created_by_id").references(() => usersTable.id, { onDelete: "set null" }),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  roleCategory: taskRoleCategoryEnum("role_category").notNull(),
  priority: varchar("priority", { length: 40 }).notNull().default("Normal"),
  status: taskStatusEnum("status").notNull().default("TODO"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const taskCommentsTable = pgTable("task_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id").notNull().references(() => tasksTable.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => usersTable.id, { onDelete: "set null" }),
  authorName: varchar("author_name", { length: 160 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const systemsTable = pgTable(
  "systems",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    description: text("description").notNull(),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    startingPrice: varchar("starting_price", { length: 120 }),
    imageUrl: text("image_url"),
    status: systemStatusEnum("status").notNull().default("DRAFT"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("systems_slug_unique").on(table.slug),
  }),
);

export const scriptTemplatesTable = pgTable(
  "script_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    description: text("description").notNull(),
    price: varchar("price", { length: 80 }).notNull().default("$5"),
    previewUrl: text("preview_url"),
    downloadUrl: text("download_url"),
    imageUrl: text("image_url"),
    status: scriptTemplateStatusEnum("status").notNull().default("DRAFT"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("script_templates_slug_unique").on(table.slug),
  }),
);

export const coursesTable = pgTable(
  "courses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    level: varchar("level", { length: 80 }).notNull(),
    duration: varchar("duration", { length: 120 }).notNull(),
    description: text("description").notNull(),
    price: varchar("price", { length: 80 }).notNull().default("$0"),
    isFree: boolean("is_free").notNull().default(true),
    isPremium: boolean("is_premium").notNull().default(false),
    status: courseStatusEnum("status").notNull().default("DRAFT"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("courses_slug_unique").on(table.slug),
  }),
);

export const courseLessonsTable = pgTable("course_lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 220 }).notNull(),
  content: text("content").notNull(),
  videoUrl: text("video_url"),
  order: integer("lesson_order").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const studentEnrollmentsTable = pgTable(
  "student_enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
    progress: integer("progress").notNull().default(0),
    status: enrollmentStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    studentCourseIdx: uniqueIndex("student_enrollments_student_course_unique").on(table.studentId, table.courseId),
  }),
);

export const quizzesTable = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id").references(() => courseLessonsTable.id, { onDelete: "set null" }),
  title: varchar("title", { length: 220 }).notNull(),
  status: quizStatusEnum("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  quizId: uuid("quiz_id").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull().default([]),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  quizId: uuid("quiz_id").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  score: integer("score").notNull().default(0),
  answers: jsonb("answers").$type<Record<string, string>>().notNull().default({}),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const learningTasksTable = pgTable("learning_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  status: learningTaskStatusEnum("status").notNull().default("TODO"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const portfolioItemsTable = pgTable("portfolio_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  projectType: varchar("project_type", { length: 120 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  description: text("description").notNull(),
  clientName: varchar("client_name", { length: 180 }),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  imageUrls: jsonb("image_urls").$type<string[]>().notNull().default([]),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  status: portfolioStatusEnum("status").notNull().default("DRAFT"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentRequestsTable = pgTable("payment_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 80 }),
  organization: varchar("organization", { length: 180 }),
  itemType: paymentRequestTypeEnum("item_type").notNull(),
  itemId: uuid("item_id"),
  itemName: varchar("item_name", { length: 220 }).notNull(),
  amount: varchar("amount", { length: 80 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  status: paymentRequestStatusEnum("status").notNull().default("PENDING_PAYMENT"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const selectUserSchema = createSelectSchema(usersTable);
export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type ContactReply = typeof contactRepliesTable.$inferSelect;
export type ClientRequest = typeof clientRequestsTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
export type TaskComment = typeof taskCommentsTable.$inferSelect;
export type System = typeof systemsTable.$inferSelect;
export type ScriptTemplate = typeof scriptTemplatesTable.$inferSelect;
export type Course = typeof coursesTable.$inferSelect;
export type CourseLesson = typeof courseLessonsTable.$inferSelect;
export type StudentEnrollment = typeof studentEnrollmentsTable.$inferSelect;
export type Quiz = typeof quizzesTable.$inferSelect;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;
export type QuizAttempt = typeof quizAttemptsTable.$inferSelect;
export type LearningTask = typeof learningTasksTable.$inferSelect;
export type PortfolioItem = typeof portfolioItemsTable.$inferSelect;
export type PaymentRequest = typeof paymentRequestsTable.$inferSelect;
