import { Router, type IRouter } from "express";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import {
  courseLessonsTable,
  coursesTable,
  courseStatusSchema,
  db,
  learningTasksTable,
  learningTaskStatusSchema,
  quizAttemptsTable,
  quizQuestionsTable,
  quizzesTable,
  quizStatusSchema,
  studentEnrollmentsTable,
  usersTable,
  type UserRole,
} from "@workspace/db";
import { getRouteParam } from "../lib/params";
import { requireAuth, requireRoles, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();
const adminRoles: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

const lessonSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(2).max(220),
  content: z.string().trim().min(2),
  videoUrl: z.string().trim().max(1000).optional().nullable(),
  order: z.coerce.number().int().min(1).default(1),
});

const courseSchema = z.object({
  title: z.string().trim().min(2).max(220),
  slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(120),
  level: z.string().trim().min(2).max(80),
  duration: z.string().trim().min(1).max(120),
  description: z.string().trim().min(10),
  price: z.string().trim().min(1).max(80).default("$0"),
  isFree: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  status: courseStatusSchema.optional(),
  featured: z.boolean().optional(),
  lessons: z.array(lessonSchema).optional(),
});

const courseUpdateSchema = courseSchema.partial();

const quizQuestionSchema = z.object({
  question: z.string().trim().min(2),
  options: z.array(z.string().trim().min(1)).min(2),
  correctAnswer: z.string().trim().min(1),
  explanation: z.string().trim().optional().nullable(),
});

const quizSchema = z.object({
  courseId: z.uuid(),
  lessonId: z.uuid().optional().nullable(),
  title: z.string().trim().min(2).max(220),
  status: quizStatusSchema.optional(),
  questions: z.array(quizQuestionSchema).optional(),
});

const quizAttemptSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

const progressSchema = z.object({
  progress: z.coerce.number().int().min(0).max(100),
});

const learningTaskSchema = z.object({
  studentId: z.uuid(),
  courseId: z.uuid(),
  title: z.string().trim().min(2).max(220),
  description: z.string().trim().min(2),
  status: learningTaskStatusSchema.optional(),
  dueDate: z.string().trim().optional().nullable(),
});

const learningTaskUpdateSchema = z.object({
  status: learningTaskStatusSchema,
});

function parseOptionalDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function replaceLessons(courseId: string, lessons: z.infer<typeof lessonSchema>[] = []) {
  await db.delete(courseLessonsTable).where(eq(courseLessonsTable.courseId, courseId));

  if (!lessons.length) return;

  await db.insert(courseLessonsTable).values(
    lessons.map((lesson, index) => ({
      courseId,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || null,
      order: lesson.order || index + 1,
    })),
  );
}

async function getCourseWithLessons(courseId: string) {
  const lessons = await db
    .select()
    .from(courseLessonsTable)
    .where(eq(courseLessonsTable.courseId, courseId))
    .orderBy(asc(courseLessonsTable.order));

  return lessons;
}

router.get("/courses", async (req, res) => {
  const featured = req.query.featured === "true";
  const where = featured
    ? and(eq(coursesTable.status, "PUBLISHED"), eq(coursesTable.featured, true))
    : eq(coursesTable.status, "PUBLISHED");

  const courses = await db.select().from(coursesTable).where(where).orderBy(desc(coursesTable.createdAt));
  res.json({ courses });
});

router.get("/courses/:slug", async (req, res) => {
  const slug = getRouteParam(req.params.slug);
  if (!slug) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(and(eq(coursesTable.slug, slug), eq(coursesTable.status, "PUBLISHED")))
    .limit(1);

  if (!course) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const lessons = await getCourseWithLessons(course.id);
  res.json({ course, lessons });
});

router.get("/admin/courses", requireAuth, requireRoles(adminRoles), async (_req, res) => {
  const courses = await db.select().from(coursesTable).orderBy(desc(coursesTable.createdAt));
  res.json({ courses });
});

router.get("/admin/courses/:id", requireAuth, requireRoles(adminRoles), async (req, res) => {
  const courseId = getRouteParam(req.params.id);
  if (!courseId) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId)).limit(1);
  if (!course) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const lessons = await getCourseWithLessons(course.id);
  res.json({ course, lessons });
});

router.post("/admin/courses", requireAuth, requireRoles(adminRoles), async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid course.", errors: parsed.error.flatten() });
    return;
  }

  const { lessons, ...courseFields } = parsed.data;
  const [course] = await db.insert(coursesTable).values(courseFields).returning();
  await replaceLessons(course.id, lessons);
  const savedLessons = await getCourseWithLessons(course.id);
  res.status(201).json({ course, lessons: savedLessons });
});

router.patch("/admin/courses/:id", requireAuth, requireRoles(adminRoles), async (req, res) => {
  const courseId = getRouteParam(req.params.id);
  if (!courseId) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const parsed = courseUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid course update.", errors: parsed.error.flatten() });
    return;
  }

  const { lessons, ...courseFields } = parsed.data;
  const [course] = await db
    .update(coursesTable)
    .set({ ...courseFields, updatedAt: new Date() })
    .where(eq(coursesTable.id, courseId))
    .returning();

  if (!course) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  if (lessons) await replaceLessons(course.id, lessons);
  const savedLessons = await getCourseWithLessons(course.id);
  res.json({ course, lessons: savedLessons });
});

router.delete("/admin/courses/:id", requireAuth, requireRoles(adminRoles), async (req, res) => {
  const courseId = getRouteParam(req.params.id);
  if (!courseId) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const [course] = await db.delete(coursesTable).where(eq(coursesTable.id, courseId)).returning();
  if (!course) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  res.json({ course });
});

router.post("/student/courses/:id/enroll", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const courseId = getRouteParam(req.params.id);
  if (!courseId) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const user = (req as AuthenticatedRequest).user;
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId)).limit(1);
  if (!course || course.status !== "PUBLISHED") {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  if (course.isPremium && !course.isFree) {
    res.status(403).json({ message: "Premium courses are locked until payment access is added." });
    return;
  }

  const [existing] = await db
    .select()
    .from(studentEnrollmentsTable)
    .where(and(eq(studentEnrollmentsTable.studentId, user.id), eq(studentEnrollmentsTable.courseId, course.id)))
    .limit(1);

  if (existing) {
    res.json({ enrollment: existing });
    return;
  }

  const [enrollment] = await db
    .insert(studentEnrollmentsTable)
    .values({ studentId: user.id, courseId: course.id, status: "ACTIVE" })
    .returning();

  res.status(201).json({ enrollment });
});

router.get("/student/enrollments", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const user = (req as AuthenticatedRequest).user;
  const enrollments = await db
    .select({ enrollment: studentEnrollmentsTable, course: coursesTable })
    .from(studentEnrollmentsTable)
    .innerJoin(coursesTable, eq(studentEnrollmentsTable.courseId, coursesTable.id))
    .where(eq(studentEnrollmentsTable.studentId, user.id))
    .orderBy(desc(studentEnrollmentsTable.updatedAt));

  res.json({ enrollments });
});

router.get("/student/courses/:id/learn", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const courseId = getRouteParam(req.params.id);
  if (!courseId) {
    res.status(404).json({ message: "Course not found." });
    return;
  }

  const user = (req as AuthenticatedRequest).user;
  const [enrollment] = await db
    .select()
    .from(studentEnrollmentsTable)
    .where(and(eq(studentEnrollmentsTable.studentId, user.id), eq(studentEnrollmentsTable.courseId, courseId)))
    .limit(1);

  if (!enrollment) {
    res.status(403).json({ message: "Enroll before viewing lessons." });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId)).limit(1);
  const lessons = await getCourseWithLessons(courseId);
  const quizzes = await db
    .select()
    .from(quizzesTable)
    .where(and(eq(quizzesTable.courseId, courseId), eq(quizzesTable.status, "PUBLISHED")))
    .orderBy(desc(quizzesTable.createdAt));
  const tasks = await db
    .select()
    .from(learningTasksTable)
    .where(and(eq(learningTasksTable.studentId, user.id), eq(learningTasksTable.courseId, courseId)))
    .orderBy(desc(learningTasksTable.createdAt));

  res.json({ course, lessons, enrollment, quizzes, tasks });
});

router.patch("/student/enrollments/:id/progress", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const enrollmentId = getRouteParam(req.params.id);
  if (!enrollmentId) {
    res.status(404).json({ message: "Enrollment not found." });
    return;
  }

  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid progress.", errors: parsed.error.flatten() });
    return;
  }

  const user = (req as AuthenticatedRequest).user;
  const [enrollment] = await db
    .update(studentEnrollmentsTable)
    .set({
      progress: parsed.data.progress,
      status: parsed.data.progress >= 100 ? "COMPLETED" : "ACTIVE",
      updatedAt: new Date(),
    })
    .where(and(eq(studentEnrollmentsTable.id, enrollmentId), eq(studentEnrollmentsTable.studentId, user.id)))
    .returning();

  if (!enrollment) {
    res.status(404).json({ message: "Enrollment not found." });
    return;
  }

  res.json({ enrollment });
});

router.get("/student/quizzes", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const user = (req as AuthenticatedRequest).user;
  const rows = await db
    .select({ quiz: quizzesTable, course: coursesTable })
    .from(quizzesTable)
    .innerJoin(coursesTable, eq(quizzesTable.courseId, coursesTable.id))
    .innerJoin(studentEnrollmentsTable, and(
      eq(studentEnrollmentsTable.courseId, coursesTable.id),
      eq(studentEnrollmentsTable.studentId, user.id),
    ))
    .where(eq(quizzesTable.status, "PUBLISHED"))
    .orderBy(desc(quizzesTable.createdAt));

  res.json({ quizzes: rows });
});

router.get("/student/quizzes/:id", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const quizId = getRouteParam(req.params.id);
  if (!quizId) {
    res.status(404).json({ message: "Quiz not found." });
    return;
  }

  const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, quizId)).limit(1);
  if (!quiz || quiz.status !== "PUBLISHED") {
    res.status(404).json({ message: "Quiz not found." });
    return;
  }

  const user = (req as AuthenticatedRequest).user;
  const [enrollment] = await db
    .select()
    .from(studentEnrollmentsTable)
    .where(and(eq(studentEnrollmentsTable.studentId, user.id), eq(studentEnrollmentsTable.courseId, quiz.courseId)))
    .limit(1);

  if (!enrollment) {
    res.status(403).json({ message: "Enroll before taking this quiz." });
    return;
  }

  const questions = await db.select().from(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, quiz.id));
  res.json({ quiz, questions: questions.map(({ correctAnswer, ...question }) => question) });
});

router.post("/student/quizzes/:id/attempt", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const quizId = getRouteParam(req.params.id);
  if (!quizId) {
    res.status(404).json({ message: "Quiz not found." });
    return;
  }

  const parsed = quizAttemptSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid quiz answers.", errors: parsed.error.flatten() });
    return;
  }

  const user = (req as AuthenticatedRequest).user;
  const questions = await db.select().from(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, quizId));
  if (!questions.length) {
    res.status(404).json({ message: "Quiz has no questions." });
    return;
  }

  const correctCount = questions.filter((question) => parsed.data.answers[question.id] === question.correctAnswer).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const [attempt] = await db
    .insert(quizAttemptsTable)
    .values({ studentId: user.id, quizId, score, answers: parsed.data.answers })
    .returning();

  res.status(201).json({
    attempt,
    results: questions.map((question) => ({
      questionId: question.id,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isCorrect: parsed.data.answers[question.id] === question.correctAnswer,
    })),
  });
});

router.get("/student/assignments", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const user = (req as AuthenticatedRequest).user;
  const tasks = await db
    .select({ task: learningTasksTable, course: coursesTable })
    .from(learningTasksTable)
    .innerJoin(coursesTable, eq(learningTasksTable.courseId, coursesTable.id))
    .where(eq(learningTasksTable.studentId, user.id))
    .orderBy(desc(learningTasksTable.createdAt));

  res.json({ tasks });
});

router.patch("/student/assignments/:id/status", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const taskId = getRouteParam(req.params.id);
  if (!taskId) {
    res.status(404).json({ message: "Assignment not found." });
    return;
  }

  const parsed = learningTaskUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid assignment status.", errors: parsed.error.flatten() });
    return;
  }

  const user = (req as AuthenticatedRequest).user;
  const [task] = await db
    .update(learningTasksTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(and(eq(learningTasksTable.id, taskId), eq(learningTasksTable.studentId, user.id)))
    .returning();

  if (!task) {
    res.status(404).json({ message: "Assignment not found." });
    return;
  }

  res.json({ task });
});

router.get("/student/progress", requireAuth, requireRoles(["STUDENT"]), async (req, res) => {
  const user = (req as AuthenticatedRequest).user;
  const enrollments = await db
    .select({ enrollment: studentEnrollmentsTable, course: coursesTable })
    .from(studentEnrollmentsTable)
    .innerJoin(coursesTable, eq(studentEnrollmentsTable.courseId, coursesTable.id))
    .where(eq(studentEnrollmentsTable.studentId, user.id))
    .orderBy(desc(studentEnrollmentsTable.updatedAt));

  const pendingTasks = await db
    .select()
    .from(learningTasksTable)
    .where(and(eq(learningTasksTable.studentId, user.id), inArray(learningTasksTable.status, ["TODO", "IN_PROGRESS"])))
    .orderBy(desc(learningTasksTable.createdAt));

  const nextEnrollment = enrollments.find((item) => item.enrollment.progress < 100);
  const nextLessons = nextEnrollment ? await getCourseWithLessons(nextEnrollment.course.id) : [];
  const lessonIndex = nextEnrollment ? Math.min(nextLessons.length - 1, Math.floor((nextEnrollment.enrollment.progress / 100) * nextLessons.length)) : -1;
  const [pendingQuiz] = nextEnrollment
    ? await db
        .select()
        .from(quizzesTable)
        .where(and(eq(quizzesTable.courseId, nextEnrollment.course.id), eq(quizzesTable.status, "PUBLISHED")))
        .orderBy(desc(quizzesTable.createdAt))
        .limit(1)
    : [];

  res.json({
    enrollments,
    guide: {
      nextLesson: lessonIndex >= 0 ? nextLessons[lessonIndex] : null,
      pendingQuiz: pendingQuiz ?? null,
      pendingAssignment: pendingTasks[0] ?? null,
      completionPercentage: enrollments.length
        ? Math.round(enrollments.reduce((sum, item) => sum + item.enrollment.progress, 0) / enrollments.length)
        : 0,
    },
  });
});

router.post("/admin/quizzes", requireAuth, requireRoles(adminRoles), async (req, res) => {
  const parsed = quizSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid quiz.", errors: parsed.error.flatten() });
    return;
  }

  const { questions, ...quizFields } = parsed.data;
  const [quiz] = await db.insert(quizzesTable).values(quizFields).returning();

  if (questions?.length) {
    await db.insert(quizQuestionsTable).values(questions.map((question) => ({ ...question, quizId: quiz.id })));
  }

  const savedQuestions = await db.select().from(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, quiz.id));
  res.status(201).json({ quiz, questions: savedQuestions });
});

router.get("/admin/progress", requireAuth, requireRoles(adminRoles), async (_req, res) => {
  const rows = await db
    .select({
      enrollment: studentEnrollmentsTable,
      course: coursesTable,
      student: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(studentEnrollmentsTable)
    .innerJoin(coursesTable, eq(studentEnrollmentsTable.courseId, coursesTable.id))
    .innerJoin(usersTable, eq(studentEnrollmentsTable.studentId, usersTable.id))
    .orderBy(desc(studentEnrollmentsTable.updatedAt));

  res.json({ enrollments: rows });
});

router.post("/admin/learning-tasks", requireAuth, requireRoles(adminRoles), async (req, res) => {
  const parsed = learningTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid learning task.", errors: parsed.error.flatten() });
    return;
  }

  const [task] = await db
    .insert(learningTasksTable)
    .values({ ...parsed.data, dueDate: parseOptionalDate(parsed.data.dueDate) })
    .returning();

  res.status(201).json({ task });
});

export default router;
