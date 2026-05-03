import { Router } from "express";
import authRoutes from "./auth.routes.js";
import studentRoutes from "./student.routes.js";
import paymentRoutes from "./payment.routes.js";
import reportRoutes from "./report.routes.js";
import settingsRoutes from "./settings.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/payments", paymentRoutes);
router.use("/reports", reportRoutes);
router.use("/settings", settingsRoutes);

export default router;
