import { Router } from "express";
import {
  login,
  logout,
  me,
  registerAdmin,
} from "../controllers/auth.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", validate(loginSchema), login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 */
router.post("/logout", logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 */
router.get("/me", protect, me);

/**
 * @route   POST /api/auth/admins
 * @desc    Register new admin (owner only)
 */
router.post(
  "/admins",
  protect,
  authorize("owner"),
  validate(registerSchema),
  registerAdmin
);

export default router;