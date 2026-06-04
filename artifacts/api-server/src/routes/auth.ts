import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db, userRoleSchema, usersTable } from "@workspace/db";
import {
  hashPassword,
  signPasswordResetToken,
  signAuthToken,
  toAuthUser,
  verifyPasswordResetToken,
  verifyPassword,
} from "../lib/auth";
import { sendPasswordResetEmail } from "../lib/email";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(100),
  role: userRoleSchema.optional().default("CLIENT"),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(100),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
});

const resetPasswordSchema = z.object({
  token: z.string().trim().min(10),
  password: z.string().min(8).max(100),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid registration data.", errors: parsed.error.flatten() });
    return;
  }

  const existingUser = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email))
    .limit(1);

  if (existingUser.length > 0) {
    res.status(409).json({ message: "An account with this email already exists." });
    return;
  }

  const [createdUser] = await db
    .insert(usersTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
    })
    .returning();

  const user = toAuthUser(createdUser);

  res.status(201).json({
    token: signAuthToken(user),
    user,
  });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid login data.", errors: parsed.error.flatten() });
    return;
  }

  const [userRecord] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email))
    .limit(1);

  if (
    !userRecord ||
    !userRecord.isActive ||
    !(await verifyPassword(parsed.data.password, userRecord.passwordHash))
  ) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const user = toAuthUser(userRecord);

  res.json({
    token: signAuthToken(user),
    user,
  });
});

router.post("/logout", (_req, res) => {
  res.status(204).send();
});

router.post("/forgot-password", async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid password reset request.", errors: parsed.error.flatten() });
    return;
  }

  const [userRecord] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email))
    .limit(1);

  if (userRecord?.isActive) {
    const token = signPasswordResetToken(userRecord.id);
    const baseUrl = process.env.FRONTEND_URL || "https://new.arosoft.io";
    await sendPasswordResetEmail({
      to: userRecord.email,
      name: userRecord.name,
      resetUrl: `${baseUrl}/login?resetToken=${encodeURIComponent(token)}`,
    });
  }

  res.json({ message: "If the account exists, password reset instructions have been sent." });
});

router.post("/reset-password", async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid password reset.", errors: parsed.error.flatten() });
    return;
  }

  try {
    const payload = verifyPasswordResetToken(parsed.data.token);
    const [userRecord] = await db
      .update(usersTable)
      .set({ passwordHash: await hashPassword(parsed.data.password), updatedAt: new Date() })
      .where(eq(usersTable.id, payload.sub))
      .returning();

    if (!userRecord) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json({ message: "Password reset successfully." });
  } catch {
    res.status(400).json({ message: "Invalid or expired password reset token." });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as AuthenticatedRequest).user });
});

export default router;
