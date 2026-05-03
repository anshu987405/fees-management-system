import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/utils";

export default function Reports() {
  const [filters, setFilters] = useState({ startDate: "", endDate: "", courseName: "" });
  const [payments, setPayments] = useState([]);

  function load() {
    api.get("/reports/fees", { params: filters }).then((res) => setPayments(res.data.data));
  }

  useEffect(load, []);

  const byMode = ["Cash", "UPI", "Online"].map((mode) => ({
    mode,
    amount: payments.filter((payment) => payment.mode === mode && payment.status === "Paid").reduce((sum, payment) => sum + payment.amount, 0)
  }));

  function exportReport() {
    const params = new URLSearchParams(filters).toString();
    window.open(`${api.defaults.baseURL}/reports/fees/export?${params}`, "_blank");
  }

  return (
    <>
      <PageHeader title="Reports" description="Analyze monthly/yearly collections and export fee data to Excel." action={<button className="btn-primary" onClick={exportReport}><Download size={17} /> Export Excel</button>} />
      <div className="panel mb-6 grid gap-3 p-4 md:grid-cols-4">
        <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        <input className="input" placeholder="Course filter" value={filters.courseName} onChange={(e) => setFilters({ ...filters, courseName: e.target.value })} />
        <button className="btn-secondary" onClick={load}>Apply Filters</button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="panel p-5">
          <h2 className="mb-5 text-lg font-extrabold">Collection by Payment Mode</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMode}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mode" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800"><h2 className="font-extrabold">Filtered Payments</h2></div>
          <div className="max-h-96 overflow-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60">
                <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Amount</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-4 py-3">{payment.student?.fullName}</td>
                    <td className="px-4 py-3">{payment.student?.courseName}</td>
                    <td className="px-4 py-3">{payment.mode}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(payment.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
