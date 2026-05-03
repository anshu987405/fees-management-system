import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Student } from "./models/Student.js";
import { Payment } from "./models/Payment.js";
import { Setting } from "./models/Setting.js";
import { generateReceiptNumber, recalculateStudentPayments } from "./services/payment.service.js";

if (process.env.ALLOW_DESTRUCTIVE_SEED !== "true") {
  console.error("Seed is destructive and only for demo reset. Set ALLOW_DESTRUCTIVE_SEED=true to run it.");
  process.exit(1);
}

const students = [
  {
    fullName: "Aarav Sharma",
    fatherName: "Rajesh Sharma",
    phone: "9876543210",
    email: "aarav@example.com",
    courseName: "Full Stack Development",
    totalFees: 65000,
    paidFees: 25000,
    admissionDate: new Date("2026-01-12")
  },
  {
    fullName: "Priya Verma",
    fatherName: "Mahesh Verma",
    phone: "9988776655",
    email: "priya@example.com",
    courseName: "Data Analytics",
    totalFees: 55000,
    paidFees: 55000,
    admissionDate: new Date("2026-02-03")
  },
  {
    fullName: "Kabir Khan",
    fatherName: "Imran Khan",
    phone: "9123456780",
    email: "kabir@example.com",
    courseName: "UI/UX Design",
    totalFees: 42000,
    paidFees: 12000,
    admissionDate: new Date("2026-03-18")
  }
];

async function seed() {
  await connectDB();
  await Promise.all([Admin.deleteMany(), Student.deleteMany(), Payment.deleteMany(), Setting.deleteMany()]);

  const admin = await Admin.create({
    name: "System Admin",
    email: "admin@feespro.local",
    password: "Admin@12345",
    role: "owner"
  });

  await Setting.create({
    instituteName: "FeesPro Academy",
    institutePhone: "+91 98765 43210",
    instituteEmail: "accounts@feespro.local",
    address: "Main Road, New Delhi",
    upiId: process.env.DEFAULT_UPI_ID || "name@upi"
  });

  for (const data of students) {
    const paidFees = data.paidFees;
    const student = await Student.create({ ...data, paidFees: 0, createdBy: admin._id });
    if (paidFees > 0) {
      await Payment.create({
        student: student._id,
        amount: paidFees,
        mode: "UPI",
        paymentDate: data.admissionDate,
        receiptNumber: await generateReceiptNumber(),
        status: "Paid",
        verifiedBy: admin._id,
        verifiedAt: new Date(),
        createdBy: admin._id
      });
      await recalculateStudentPayments(student._id);
    }
  }

  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
