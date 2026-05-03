import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    mode: { type: String, enum: ["Cash", "UPI", "Online"], required: true },
    paymentDate: { type: Date, default: Date.now, index: true },
    receiptNumber: { type: String, required: true, unique: true },
    receiptShareToken: { type: String, unique: true, sparse: true, index: true },
    receiptSharedAt: Date,
    notes: String,
    screenshotUrl: String,
    status: { type: String, enum: ["Paid", "Pending", "Verification Pending", "Rejected"], default: "Paid" },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    verifiedAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
