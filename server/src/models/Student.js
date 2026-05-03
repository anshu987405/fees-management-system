import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, index: true },
    fatherName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    courseName: { type: String, required: true, trim: true, index: true },
    totalFees: { type: Number, required: true, min: 0 },
    paidFees: { type: Number, default: 0, min: 0 },
    remainingFees: { type: Number, default: 0, min: 0 },
    admissionDate: { type: Date, required: true },
    status: { type: String, enum: ["Paid", "Pending", "Overdue", "Verification Pending"], default: "Pending" },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

studentSchema.index({ fullName: "text", fatherName: "text", phone: "text", courseName: "text" });

studentSchema.pre("validate", function calculateFees(next) {
  this.paidFees = Math.min(Number(this.paidFees || 0), Number(this.totalFees || 0));
  this.remainingFees = Math.max(Number(this.totalFees || 0) - Number(this.paidFees || 0), 0);

  if (this.status !== "Verification Pending") {
    const overdueAt = new Date(this.admissionDate);
    overdueAt.setDate(overdueAt.getDate() + 30);
    this.status = this.remainingFees === 0 ? "Paid" : overdueAt < new Date() ? "Overdue" : "Pending";
  }

  next();
});

export const Student = mongoose.model("Student", studentSchema);
