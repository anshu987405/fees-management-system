import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { settingsSchema } from "../validators/settings.validator.js";

const router = Router();

router.use(protect);
router.get("/", getSettings);
router.patch("/", authorize("owner", "admin"), validate(settingsSchema), updateSettings);

export default router;
