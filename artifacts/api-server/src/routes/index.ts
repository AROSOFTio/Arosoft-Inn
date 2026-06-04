import { Router, type IRouter } from "express";
import adminProjectsRouter from "./admin-projects";
import adminRequestsRouter from "./admin-requests";
import adminTasksRouter from "./admin-tasks";
import authRouter from "./auth";
import clientProjectsRouter from "./client-projects";
import clientRequestsRouter from "./client-requests";
import contactRouter from "./contact";
import dashboardRouter from "./dashboard";
import healthRouter from "./health";
import supportRouter from "./support";
import tasksRouter from "./tasks";

const router: IRouter = Router();

router.use("/auth", authRouter);
router.use(contactRouter);
router.use(clientRequestsRouter);
router.use(clientProjectsRouter);
router.use(adminRequestsRouter);
router.use(adminProjectsRouter);
router.use(adminTasksRouter);
router.use(supportRouter);
router.use(tasksRouter);
router.use(dashboardRouter);
router.use(healthRouter);

export default router;
