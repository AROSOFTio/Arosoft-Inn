import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import type { User, UserRole } from "@workspace/db/schema";

const saltRounds = 12;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokenPayload extends jwt.JwtPayload {
  sub: string;
  role: UserRole;
}

export interface PasswordResetTokenPayload extends jwt.JwtPayload {
  sub: string;
  purpose: "password_reset";
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required.");
  }

  return secret;
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function signAuthToken(user: AuthUser) {
  return jwt.sign({ role: user.role }, getJwtSecret(), {
    subject: user.id,
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
}

export function signPasswordResetToken(userId: string) {
  return jwt.sign({ purpose: "password_reset" }, getJwtSecret(), {
    subject: userId,
    expiresIn: "30m",
  });
}

export function verifyPasswordResetToken(token: string) {
  const payload = jwt.verify(token, getJwtSecret()) as PasswordResetTokenPayload;
  if (payload.purpose !== "password_reset") {
    throw new Error("Invalid password reset token.");
  }
  return payload;
}
