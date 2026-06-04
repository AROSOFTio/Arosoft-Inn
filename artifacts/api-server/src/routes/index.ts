import { Router, type IRouter } from "express";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import healthRouter from "./health";

const router: IRouter = Router();

router.use("/auth", authRouter);
router.use(dashboardRouter);
router.use(healthRouter);

export default router;
