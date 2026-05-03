import { Payment } from "../models/Payment.js";
import { Student } from "../models/Student.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dashboardSummary, buildReportMatch } from "../services/report.service.js";
import { workbookBuffer } from "../services/excel.service.js";

export const dashboard = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await dashboardSummary() });
});

export const feeReport = asyncHandler(async (req, res) => {
  const match = buildReportMatch(req.query);
  const payments = await Payment.find(match).populate("student", "fullName phone courseName").sort({ paymentDate: -1 });

  let filtered = payments;
  if (req.query.courseName) {
    filtered = filtered.filter((payment) => payment.student?.courseName === req.query.courseName);
  }
  if (req.query.studentId) {
    filtered = filtered.filter((payment) => String(payment.student?._id) === req.query.studentId);
  }

  res.json({ success: true, data: filtered });
});

export const exportFeeReport = asyncHandler(async (req, res) => {
  const match = buildReportMatch(req.query);
  const [payments, students] = await Promise.all([
    Payment.find(match).populate("student", "fullName phone courseName").sort({ paymentDate: -1 }).lean(),
    Student.find().lean()
  ]);

  const rows = payments.map((payment) => ({
    Receipt: payment.receiptNumber,
    Student: payment.student?.fullName,
    Phone: payment.student?.phone,
    Course: payment.student?.courseName,
    Amount: payment.amount,
    Mode: payment.mode,
    Status: payment.status,
    Date: payment.paymentDate?.toISOString().slice(0, 10)
  }));

  const studentRows = students.map((student) => ({
    Student: student.fullName,
    Course: student.courseName,
    "Total Fees": student.totalFees,
    Collected: student.paidFees,
    Pending: student.remainingFees,
    Status: student.status
  }));

  const buffer = await workbookBuffer({ "Fee Report": rows, Students: studentRows });
  res.setHeader("Content-Disposition", "attachment; filename=fee-report.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
});
