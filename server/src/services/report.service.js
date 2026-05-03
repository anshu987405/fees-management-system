import { Payment } from "../models/Payment.js";
import { Student } from "../models/Student.js";

export async function dashboardSummary() {
  const [studentCount, feeTotals, pendingVerification, monthlyRevenue, courseBreakdown] = await Promise.all([
    Student.countDocuments(),
    Student.aggregate([
      {
        $group: {
          _id: null,
          totalFees: { $sum: "$totalFees" },
          paidFees: { $sum: "$paidFees" },
          remainingFees: { $sum: "$remainingFees" }
        }
      }
    ]),
    Payment.countDocuments({ status: "Verification Pending" }),
    Payment.aggregate([
      { $match: { status: "Paid" } },
      {
        $group: {
          _id: { year: { $year: "$paymentDate" }, month: { $month: "$paymentDate" } },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]),
    Student.aggregate([
      {
        $group: {
          _id: "$courseName",
          students: { $sum: 1 },
          pending: { $sum: "$remainingFees" },
          collected: { $sum: "$paidFees" }
        }
      },
      { $sort: { students: -1 } }
    ])
  ]);

  const totals = feeTotals[0] || { totalFees: 0, paidFees: 0, remainingFees: 0 };

  return {
    totalStudents: studentCount,
    totalFees: totals.totalFees,
    totalCollected: totals.paidFees,
    pendingFees: totals.remainingFees,
    pendingVerification,
    monthlyRevenue: monthlyRevenue.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      revenue: item.revenue,
      payments: item.count
    })),
    courseBreakdown: courseBreakdown.map((item) => ({
      courseName: item._id,
      students: item.students,
      pending: item.pending,
      collected: item.collected
    }))
  };
}

export function buildReportMatch(query) {
  const match = {};
  if (query.startDate || query.endDate) {
    match.paymentDate = {};
    if (query.startDate) match.paymentDate.$gte = new Date(query.startDate);
    if (query.endDate) match.paymentDate.$lte = new Date(query.endDate);
  }
  if (query.status) match.status = query.status;
  return match;
}
