import { Router } from "express";
import { login, register, loginWithDVLA, loginWithGhanaCard, registerWithGhanaCard } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/login/ghana-card", loginWithGhanaCard);
router.post("/login/dvla", loginWithDVLA);
router.post("/register/ghana-card", registerWithGhanaCard);

export default router;
