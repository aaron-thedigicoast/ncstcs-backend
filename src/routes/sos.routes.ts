import { Router } from "express";
import { getAllSOS, createSOS, resolveSOS } from "../controllers/sos.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getAllSOS);
router.post("/", createSOS);
router.post("/:id/resolve", requireAuth, resolveSOS);

export default router;
