import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, type UserRole } from "@workspace/db";
import { toAuthUser, verifyAuthToken, type AuthUser } from "../lib/auth";

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.header("authorization");
  const [scheme, token] = authHeader?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Authentication token is required." });
    return;
  }

  try {
    const payload = verifyAuthToken(token);

    if (!payload.sub) {
      res.status(401).json({ message: "Invalid authentication token." });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.sub))
      .limit(1);

    if (!user || !user.isActive) {
      res.status(401).json({ message: "User account is not active." });
      return;
    }

    (req as AuthenticatedRequest).user = toAuthUser(user);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}

export function requireRoles(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Partial<AuthenticatedRequest>).user;

    if (!user) {
      res.status(401).json({ message: "Authentication is required." });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "You do not have access to this resource." });
      return;
    }

    next();
  };
}
