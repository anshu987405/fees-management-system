import { Router } from "express";
import { login, logout, me, registerAdmin } from "../controllers/auth.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post("/admins", protect, authorize("owner"), validate(registerSchema), registerAdmin);

export default router;
