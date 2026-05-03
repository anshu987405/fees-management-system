import fs from "fs";
import { Student } from "../models/Student.js";
import { Payment } from "../models/Payment.js";
import { Setting } from "../models/Setting.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";
import { buildUpiQrDataUrl, buildUpiUri } from "../utils/upi.js";
import { readFirstSheet, workbookBuffer } from "../services/excel.service.js";

function studentFilter(query) {
  const filter = {};
  if (query.search) filter.$text = { $search: query.search };
  if (query.courseName) filter.courseName = query.courseName;
  if (query.status) filter.status = query.status;
  return filter;
}

export const listStudents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = studentFilter(req.query);
  const [students, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(filter)
  ]);

  res.json({ success: true, data: students, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create({ ...req.body, createdBy: req.admin._id });
  res.status(201).json({ success: true, data: student });
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");

  const [payments, settings] = await Promise.all([
    Payment.find({ student: student._id }).sort({ paymentDate: -1 }),
    Setting.findOne()
  ]);

  const amount = student.remainingFees || student.totalFees;
  const upiId = settings?.upiId || process.env.DEFAULT_UPI_ID || "name@upi";
  const qrDataUrl = await buildUpiQrDataUrl({ upiId, name: student.fullName, amount });
  const upiUri = buildUpiUri({ upiId, name: student.fullName, amount });

  res.json({ success: true, data: { student, payments, qrDataUrl, upiUri } });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");
  Object.assign(student, req.body);
  await student.save();
  res.json({ success: true, data: student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");
  await Payment.deleteMany({ student: student._id });
  await student.deleteOne();
  res.json({ success: true });
});

export const importStudents = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Excel file is required");

  const rows = await readFirstSheet(req.file.path);
  const invalid = [];
  const created = [];

  for (const [index, row] of rows.entries()) {
    try {
      const student = await Student.create({
        fullName: row.fullName || row["Full Name"],
        fatherName: row.fatherName || row["Father Name"],
        phone: String(row.phone || row["Phone Number"] || ""),
        email: row.email || row.Email || "",
        courseName: row.courseName || row["Course Name"],
        totalFees: Number(row.totalFees || row["Total Fees"] || 0),
        paidFees: Number(row.paidFees || row["Paid Fees"] || 0),
        admissionDate: row.admissionDate || row["Admission Date"] || new Date(),
        createdBy: req.admin._id
      });
      created.push(student);
    } catch (error) {
      invalid.push({ row: index + 2, reason: error.message, data: row });
    }
  }

  fs.unlink(req.file.path, () => {});
  res.status(201).json({ success: true, created: created.length, invalid });
});

export const exportStudents = asyncHandler(async (req, res) => {
  const students = await Student.find(studentFilter(req.query)).lean();
  const rows = students.map((student) => ({
    "Full Name": student.fullName,
    "Father Name": student.fatherName,
    Phone: student.phone,
    Email: student.email,
    Course: student.courseName,
    "Total Fees": student.totalFees,
    "Paid Fees": student.paidFees,
    "Remaining Fees": student.remainingFees,
    Status: student.status,
    "Admission Date": student.admissionDate?.toISOString().slice(0, 10)
  }));

  const buffer = await workbookBuffer({ Students: rows });
  res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
});
