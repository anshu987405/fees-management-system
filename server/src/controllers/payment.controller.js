import { Payment } from "../models/Payment.js";
import { Student } from "../models/Student.js";
import { Setting } from "../models/Setting.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { createPayment, generateReceiptShareToken, recalculateStudentPayments } from "../services/payment.service.js";
import { receiptHtml, receiptText } from "../services/receipt.service.js";
import { buildUpiQrDataUrl, buildUpiUri } from "../utils/upi.js";

export const listPayments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.studentId) filter.student = req.query.studentId;

  const [payments, total] = await Promise.all([
    Payment.find(filter).populate("student", "fullName phone courseName").sort({ paymentDate: -1 }).skip(skip).limit(limit),
    Payment.countDocuments(filter)
  ]);

  res.json({ success: true, data: payments, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const recordPayment = asyncHandler(async (req, res) => {
  const payment = await createPayment({
    studentId: req.body.studentId,
    payload: req.body,
    adminId: req.admin._id,
    screenshotUrl: req.file ? `/uploads/${req.file.filename}` : undefined
  });

  res.status(201).json({ success: true, data: payment });
});

export const publicPaymentForm = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const amount = Number(req.query.amount || student.remainingFees || 0);
  const settings = await Setting.findOne();
  const upiId = settings?.upiId || process.env.DEFAULT_UPI_ID || "name@upi";
  const upiUri = buildUpiUri({ upiId, name: student.fullName, amount });
  const upiQr = await buildUpiQrDataUrl({ upiId, name: student.fullName, amount });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Submit Payment Proof</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f1f5f9; font-family: "Segoe UI", Arial, sans-serif; color: #111827; padding: 18px; }
    .card { width: min(520px, 100%); background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 24px; box-shadow: 0 20px 60px rgba(15,23,42,.12); }
    h1 { margin: 0; font-size: 24px; }
    p { color: #64748b; line-height: 1.5; }
    label { display: block; margin-top: 14px; font-weight: 700; font-size: 14px; }
    input, select, textarea { width: 100%; margin-top: 7px; border: 1px solid #dbe3ef; border-radius: 10px; padding: 11px; font: inherit; }
    button { width: 100%; margin-top: 18px; border: 0; border-radius: 10px; padding: 12px; background: #059669; color: white; font-weight: 800; font-size: 15px; }
    .meta { background: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px; margin-top: 16px; color: #065f46; font-weight: 700; }
    .qr { margin: 16px auto; display: block; width: 240px; height: 240px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 10px; }
    .pay { display: block; text-align: center; text-decoration: none; margin-top: 14px; border-radius: 10px; padding: 12px; background: #0f766e; color: white; font-weight: 800; }
    .hint { font-size: 13px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <form class="card" method="post" enctype="multipart/form-data" action="/api/payments/public-pay/${student._id}">
    <h1>${settings?.instituteName || "FeesPro"} Fee Payment</h1>
    <p>Pay fees using UPI, then upload your payment screenshot/UTR below. Admin will verify and approve your fee receipt.</p>
    <div class="meta">${student.fullName} - ${student.courseName}</div>
    <img class="qr" src="${upiQr}" alt="UPI QR" />
    <div class="hint">Amount: ₹${amount} | UPI ID: ${upiId}</div>
    <a class="pay" href="${upiUri}">Pay Now With UPI</a>
    <label>Paid Amount
      <input name="amount" type="number" min="1" value="${amount}" required />
    </label>
    <label>Payment Mode
      <select name="mode"><option>UPI</option><option>Online</option></select>
    </label>
    <label>Payment Screenshot
      <input name="screenshot" type="file" accept="image/png,image/jpeg,image/webp" required />
    </label>
    <label>Note / UTR
      <textarea name="notes" rows="3" placeholder="Enter UTR or transaction note"></textarea>
    </label>
    <button type="submit">Submit For Verification</button>
  </form>
</body>
</html>`);
});

export const publicPaymentSubmit = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (!req.file) {
    throw new ApiError(400, "Payment screenshot is required");
  }

  const payment = await createPayment({
    studentId: student._id,
    payload: {
      amount: Number(req.body.amount),
      mode: req.body.mode || "UPI",
      notes: req.body.notes,
      verificationPending: true
    },
    adminId: undefined,
    screenshotUrl: `/uploads/${req.file.filename}`
  });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Payment Submitted</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f1f5f9; font-family: "Segoe UI", Arial, sans-serif; color: #111827; padding: 18px; }
    .card { width: min(520px, 100%); background: white; border: 1px solid #e5e7eb; border-radius: 18px; padding: 24px; box-shadow: 0 20px 60px rgba(15,23,42,.12); text-align: center; }
    h1 { color: #047857; }
    p { color: #64748b; line-height: 1.5; }
    .receipt { margin-top: 16px; border-radius: 12px; background: #ecfdf5; padding: 12px; color: #065f46; font-weight: 800; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Payment Request Sent</h1>
    <p>Your payment screenshot has been submitted. Admin will approve it after verification.</p>
    <div class="receipt">Request No: ${payment.receiptNumber}</div>
  </div>
</body>
</html>`);
});

export const approvePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new ApiError(404, "Payment not found");

  payment.status = "Paid";
  payment.verifiedBy = req.admin._id;
  payment.verifiedAt = new Date();
  await payment.save();
  const student = await recalculateStudentPayments(payment.student);

  res.json({ success: true, data: { payment, student } });
});

export const rejectPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new ApiError(404, "Payment not found");

  payment.status = "Rejected";
  payment.verifiedBy = req.admin._id;
  payment.verifiedAt = new Date();
  payment.notes = req.body.reason || payment.notes;
  await payment.save();
  const student = await recalculateStudentPayments(payment.student);

  res.json({ success: true, data: { payment, student } });
});

export const receipt = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate("student");
  if (!payment) throw new ApiError(404, "Payment not found");
  if (!payment.receiptShareToken) {
    payment.receiptShareToken = generateReceiptShareToken();
    await payment.save();
  }

  const settings = await Setting.findOne();
  const publicUrl = `${req.protocol}://${req.get("host")}/api/payments/public-receipts/${payment.receiptShareToken}`;

  res.json({
    success: true,
    data: {
      receiptNumber: payment.receiptNumber,
      payment,
      student: payment.student,
      settings,
      publicUrl,
      whatsappText: `${receiptText({ payment, student: payment.student, settings })}\n\nReceipt link: ${publicUrl}`,
      issuedAt: new Date()
    }
  });
});

export const receiptPage = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate("student");
  if (!payment) throw new ApiError(404, "Payment not found");
  if (!payment.receiptShareToken) {
    payment.receiptShareToken = generateReceiptShareToken();
    await payment.save();
  }

  const settings = await Setting.findOne();
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(receiptHtml({ payment, student: payment.student, settings }));
});

export const publicReceiptPage = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ receiptShareToken: req.params.token }).populate("student");
  if (!payment) throw new ApiError(404, "Receipt not found");

  payment.receiptSharedAt = new Date();
  await payment.save();

  const settings = await Setting.findOne();
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(receiptHtml({ payment, student: payment.student, settings }));
});

export const pendingStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({ remainingFees: { $gt: 0 } }).sort({ remainingFees: -1 }).limit(100);
  res.json({ success: true, data: students });
});
