import type { NextFunction, Request, Response } from "express";

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

export function cleanApiErrors(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = typeof err === "object" && err && "status" in err && typeof err.status === "number" ? err.status : 500;
  const message = status >= 500 ? "Internal server error." : err instanceof Error ? err.message : "Request failed.";
  res.status(status).json({ message });
}
