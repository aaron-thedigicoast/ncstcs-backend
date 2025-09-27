import { Router } from "express";
import { getDashboardData } from "../controllers/analytics.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/dashboard", requireAuth, getDashboardData);

export default router;
