import { Router } from "express";
import {
  login,
  logout,
  me
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

// LOGIN
router.post("/login", validate(loginSchema), login);

// LOGOUT
router.post("/logout", logout);

// CURRENT USER
router.get("/me", protect, me);

export default router;