import { Router, type IRouter } from "express";
import { requireAuth, requireRoles } from "../middleware/auth";

const router: IRouter = Router();

router.get(
  "/dashboard/admin",
  requireAuth,
  requireRoles(["SUPER_ADMIN", "ADMIN"]),
  (_req, res) => res.json({ dashboard: "admin" }),
);

router.get(
  "/dashboard/support",
  requireAuth,
  requireRoles(["SUPPORT"]),
  (_req, res) => res.json({ dashboard: "support" }),
);

router.get(
  "/dashboard/client",
  requireAuth,
  requireRoles(["CLIENT"]),
  (_req, res) => res.json({ dashboard: "client" }),
);

router.get(
  "/dashboard/student",
  requireAuth,
  requireRoles(["STUDENT"]),
  (_req, res) => res.json({ dashboard: "student" }),
);

router.get(
  "/dashboard/developer",
  requireAuth,
  requireRoles(["FRONTEND_DEVELOPER", "BACKEND_DEVELOPER", "FULLSTACK_DEVELOPER"]),
  (_req, res) => res.json({ dashboard: "developer" }),
);

router.get(
  "/dashboard/marketing",
  requireAuth,
  requireRoles(["MARKETING"]),
  (_req, res) => res.json({ dashboard: "marketing" }),
);

router.get(
  "/dashboard/video",
  requireAuth,
  requireRoles(["VIDEO_EDITOR"]),
  (_req, res) => res.json({ dashboard: "video" }),
);

router.get(
  "/dashboard/finance",
  requireAuth,
  requireRoles(["FINANCE"]),
  (_req, res) => res.json({ dashboard: "finance" }),
);

router.get(
  "/dashboard/compliance",
  requireAuth,
  requireRoles(["COMPLIANCE"]),
  (_req, res) => res.json({ dashboard: "compliance" }),
);

export default router;
