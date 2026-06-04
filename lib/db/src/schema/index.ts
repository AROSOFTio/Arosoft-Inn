import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  boolean,
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
