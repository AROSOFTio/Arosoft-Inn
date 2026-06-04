import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import path from "node:path";
import router from "./routes";
import { logger } from "./lib/logger";
import { rateLimit } from "./middleware/rate-limit";
import { cleanApiErrors, securityHeaders } from "./middleware/security";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(securityHeaders);
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin not allowed."));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads"), {
  fallthrough: false,
  maxAge: "7d",
}));

app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));
app.use("/api/contact", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));
app.use("/api/assistant", rateLimit({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use("/api", router);
app.use(cleanApiErrors);

export default app;
