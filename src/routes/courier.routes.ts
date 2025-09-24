import { Router } from "express";
import {
  getAllCouriers, getCourierById, createCourier, updateCourierLocation, getCourierHistory
} from "../controllers/courier.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getAllCouriers);
router.post("/", requireAuth, createCourier);
router.get("/:id", requireAuth, getCourierById);
router.post("/:id/location", requireAuth, updateCourierLocation);
router.get("/:id/history", requireAuth, getCourierHistory);

export default router;
