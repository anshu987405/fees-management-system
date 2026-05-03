import { Router } from "express";
import { dashboard, exportFeeReport, feeReport } from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/dashboard", dashboard);
router.get("/fees", feeReport);
router.get("/fees/export", exportFeeReport);

export default router;
