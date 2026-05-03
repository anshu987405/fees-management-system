import { Payment } from "../models/Payment.js";
import { Student } from "../models/Student.js";
import { ApiError } from "../utils/apiError.js";
import crypto from "crypto";

export async function generateReceiptNumber() {
  const today = new Date();
  const stamp = today.toISOString().slice(0, 10).replace(/-/g, "");
  const count = await Payment.countDocuments({
    createdAt: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    }
  });

  return `RCPT-${stamp}-${String(count + 1).padStart(4, "0")}`;
}

export function generateReceiptShareToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function recalculateStudentPayments(studentId) {
  const paid = await Payment.aggregate([
    { $match: { student: studentId, status: "Paid" } },
    { $group: { _id: "$student", total: { $sum: "$amount" } } }
  ]);

  const totalPaid = paid[0]?.total || 0;
  const pendingVerification = await Payment.exists({ student: studentId, status: "Verification Pending" });
  const student = await Student.findById(studentId);

  if (!student) throw new ApiError(404, "Student not found");

  student.paidFees = Math.min(totalPaid, student.totalFees);
  student.remainingFees = Math.max(student.totalFees - student.paidFees, 0);
  student.status = pendingVerification ? "Verification Pending" : student.remainingFees === 0 ? "Paid" : "Pending";
  await student.save();

  return student;
}

export async function createPayment({ studentId, payload, adminId, screenshotUrl, screenshotDataUrl }) {
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const status = payload.verificationPending ? "Verification Pending" : "Paid";
  const payment = await Payment.create({
    student: studentId,
    amount: payload.amount,
    mode: payload.mode,
    paymentDate: payload.paymentDate || new Date(),
    notes: payload.notes,
    screenshotUrl,
    screenshotDataUrl,
    status,
    receiptNumber: await generateReceiptNumber(),
    receiptShareToken: generateReceiptShareToken(),
    createdBy: adminId,
    verifiedBy: status === "Paid" ? adminId : undefined,
    verifiedAt: status === "Paid" ? new Date() : undefined
  });

  await recalculateStudentPayments(student._id);
  return payment.populate("student");
}
