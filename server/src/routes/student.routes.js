import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  exportStudents,
  getStudent,
  importStudents,
  listStudents,
  updateStudent
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { studentSchema, studentUpdateSchema } from "../validators/student.validator.js";

const router = Router();

router.use(protect);
router.get("/", listStudents);
router.post("/", validate(studentSchema), createStudent);
router.get("/export", exportStudents);
router.post("/import", upload.single("file"), importStudents);
router.get("/:id", getStudent);
router.patch("/:id", validate(studentUpdateSchema), updateStudent);
router.delete("/:id", deleteStudent);

export default router;
