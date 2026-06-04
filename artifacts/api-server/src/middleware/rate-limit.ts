import type { NextFunction, Request, Response } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

const buckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(req: Request) {
  return `${req.ip}:${req.method}:${req.originalUrl.split("?")[0]}`;
}

export function rateLimit({ windowMs, max }: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = clientKey(req);
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    bucket.count += 1;

    if (bucket.count > max) {
      res.status(429).json({ message: "Too many requests. Please try again later." });
      return;
    }

    next();
  };
}
