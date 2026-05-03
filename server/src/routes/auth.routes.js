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

// LOGIN
router.post("/login", validate(loginSchema), login);

// LOGOUT
router.post("/logout", logout);

// CURRENT USER
router.get("/me", protect, me);

// REGISTER ADMIN
router.post(
  "/admins",
  protect,
  authorize("owner"),
  validate(registerSchema),
  registerAdmin
);

export default router;