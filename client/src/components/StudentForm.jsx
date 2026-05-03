import { useState } from "react";

const empty = {
  fullName: "",
  fatherName: "",
  phone: "",
  email: "",
  courseName: "",
  totalFees: "",
  paidFees: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  notes: ""
};

export default function StudentForm({ initialValues, onSubmit, loading }) {
  const [values, setValues] = useState({ ...empty, ...initialValues, admissionDate: initialValues?.admissionDate?.slice?.(0, 10) || empty.admissionDate });

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {[
        ["fullName", "Full Name"],
        ["fatherName", "Father Name"],
        ["phone", "Phone Number"],
        ["email", "Email"],
        ["courseName", "Course Name"],
        ["totalFees", "Total Fees"],
        ["paidFees", "Paid Fees"],
        ["admissionDate", "Admission Date"]
      ].map(([field, label]) => (
        <label key={field} className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {label}
          <input
            className="input mt-1"
            type={field.includes("Fees") ? "number" : field === "admissionDate" ? "date" : "text"}
            value={values[field] || ""}
            onChange={(event) => setField(field, event.target.value)}
            required={!["email", "paidFees"].includes(field)}
          />
        </label>
      ))}
      <label className="sm:col-span-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Notes
        <textarea className="input mt-1 min-h-24" value={values.notes || ""} onChange={(event) => setField("notes", event.target.value)} />
      </label>
      <div className="sm:col-span-2 flex justify-end">
        <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Student"}</button>
      </div>
    </form>
  );
}
