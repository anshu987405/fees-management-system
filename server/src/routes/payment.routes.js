import { Router } from "express";
import {
  approvePayment,
  listPayments,
  pendingStudents,
  publicPaymentForm,
  publicPaymentSubmit,
  publicReceiptPage,
  receipt,
  receiptPage,
  recordPayment,
  rejectPayment
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { paymentSchema } from "../validators/payment.validator.js";

const router = Router();

router.get("/public-receipts/:token", publicReceiptPage);
router.get("/public-pay/:studentId", publicPaymentForm);
router.post("/public-pay/:studentId", upload.single("screenshot"), publicPaymentSubmit);
router.use(protect);
router.get("/", listPayments);
router.post("/", upload.single("screenshot"), validate(paymentSchema), recordPayment);
router.get("/pending-students", pendingStudents);
router.get("/:id/receipt", receipt);
router.get("/:id/receipt-page", receiptPage);
router.patch("/:id/approve", approvePayment);
router.patch("/:id/reject", rejectPayment);

export default router;
