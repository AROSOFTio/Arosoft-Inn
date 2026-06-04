import { Router, type IRouter } from "express";
import adminRequestsRouter from "./admin-requests";
import authRouter from "./auth";
import clientRequestsRouter from "./client-requests";
import contactRouter from "./contact";
import dashboardRouter from "./dashboard";
import healthRouter from "./health";
import supportRouter from "./support";

const router: IRouter = Router();

router.use("/auth", authRouter);
router.use(contactRouter);
router.use(clientRequestsRouter);
router.use(adminRequestsRouter);
router.use(supportRouter);
router.use(dashboardRouter);
router.use(healthRouter);

export default router;
