import { Router } from "express";
import { getAllCouriers, getCourierById } from "../controllers/courier.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getAllCouriers);
router.get("/:id", requireAuth, getCourierById);

export default router;
