import { useState } from "react";

export default function PaymentForm({ students = [], defaultStudentId = "", onSubmit, loading }) {
  const [values, setValues] = useState({
    studentId: defaultStudentId,
    amount: "",
    mode: "UPI",
    paymentDate: new Date().toISOString().slice(0, 10),
    verificationPending: false,
    notes: "",
    screenshot: null
  });

  function submit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Student
        <select className="input mt-1" value={values.studentId} onChange={(e) => setValues({ ...values, studentId: e.target.value })} required>
          <option value="">Select student</option>
          {students.map((student) => <option key={student._id} value={student._id}>{student.fullName} - {student.courseName}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Amount
        <input className="input mt-1" type="number" min="1" value={values.amount} onChange={(e) => setValues({ ...values, amount: e.target.value })} required />
      </label>
      <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Mode
        <select className="input mt-1" value={values.mode} onChange={(e) => setValues({ ...values, mode: e.target.value })}>
          <option>Cash</option>
          <option>UPI</option>
          <option>Online</option>
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Payment Date
        <input className="input mt-1" type="date" value={values.paymentDate} onChange={(e) => setValues({ ...values, paymentDate: e.target.value })} />
      </label>
      <label className="sm:col-span-2 flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={values.verificationPending} onChange={(e) => setValues({ ...values, verificationPending: e.target.checked })} />
        Mark as verification pending
      </label>
      <label className="sm:col-span-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Payment Screenshot
        <input className="input mt-1" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setValues({ ...values, screenshot: e.target.files?.[0] || null })} />
      </label>
      <label className="sm:col-span-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Notes
        <textarea className="input mt-1 min-h-20" value={values.notes} onChange={(e) => setValues({ ...values, notes: e.target.value })} />
      </label>
      <div className="sm:col-span-2 flex justify-end">
        <button className="btn-primary" disabled={loading}>{loading ? "Recording..." : "Record Payment"}</button>
      </div>
    </form>
  );
}
