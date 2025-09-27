
import { Router } from "express";
import { uploadComplianceFiles, serveComplianceFile, currentUser } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/compliance-upload", requireAuth, upload.fields([
    { name: 'dvlaLicense', maxCount: 1 },
    { name: 'ghanaCard', maxCount: 1 }
]), uploadComplianceFiles);

router.get("/compliance-files/:filename", serveComplianceFile);
router.get("/current-user", requireAuth, currentUser);

export default router;
