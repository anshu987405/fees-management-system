import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { CreditCard, GraduationCap, IndianRupee, TimerReset } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/utils";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then((res) => setData(res.data.data));
  }, []);

  if (!data) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="panel h-32 animate-pulse bg-slate-100" />)}</div>;

  return (
    <>
      <PageHeader title="Dashboard" description="Live fee collection, pending balance, verification queue, and course-level health." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={data.totalStudents} icon={GraduationCap} tone="sky" />
        <StatCard label="Fees Collected" value={data.totalCollected} icon={IndianRupee} money />
        <StatCard label="Pending Fees" value={data.pendingFees} icon={TimerReset} money tone="amber" />
        <StatCard label="Verification Queue" value={data.pendingVerification} icon={CreditCard} tone="slate" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="panel p-5">
          <h2 className="mb-5 text-lg font-extrabold">Monthly Revenue</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} fill="url(#revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="mb-5 text-lg font-extrabold">Course Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.courseBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="courseName" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="collected" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
