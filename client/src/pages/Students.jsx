import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Edit, Plus, QrCode, Search, Send, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import QrPaymentModal from "../components/QrPaymentModal";
import StudentForm from "../components/StudentForm";
import { api } from "../lib/api";
import { formatCurrency, statusClass, whatsappReminder } from "../lib/utils";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({});
  const [query, setQuery] = useState({ search: "", status: "" });
  const [modal, setModal] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  function load(page = 1) {
    api.get("/students", { params: { ...query, page } }).then((res) => {
      setStudents(res.data.data);
      setMeta(res.data.meta);
    });
  }

  useEffect(() => {
    load();
  }, [query.status]);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data.data)).catch(() => {});
  }, []);

  async function saveStudent(values) {
    setLoading(true);
    try {
      if (modal?.type === "edit") {
        await api.patch(`/students/${modal.student._id}`, values);
        toast.success("Student updated");
      } else {
        await api.post("/students", values);
        toast.success("Student added");
      }
      setModal(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save student");
    } finally {
      setLoading(false);
    }
  }

  async function importExcel(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/students/import", form);
    toast.success(`Imported ${res.data.created} students`);
    load();
  }

  function exportExcel() {
    window.open(`${api.defaults.baseURL}/students/export`, "_blank");
  }

  async function deleteStudent(student) {
    if (!confirm(`Delete ${student.fullName}? This also removes payment history.`)) return;
    await api.delete(`/students/${student._id}`);
    toast.success("Student deleted");
    load();
  }

  return (
    <>
      <PageHeader
        title="Students"
        description="Manage admissions, fee balance, WhatsApp reminders, and student profiles."
        action={<button className="btn-primary" onClick={() => setModal({ type: "add" })}><Plus size={17} /> Add Student</button>}
      />
      <div className="panel mb-5 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input className="input pl-10" placeholder="Search name, father, phone, course" value={query.search} onChange={(e) => setQuery({ ...query, search: e.target.value })} onKeyDown={(e) => e.key === "Enter" && load()} />
        </div>
        <select className="input lg:w-48" value={query.status} onChange={(e) => setQuery({ ...query, status: e.target.value })}>
          <option value="">All statuses</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Overdue</option>
          <option>Verification Pending</option>
        </select>
        <label className="btn-secondary cursor-pointer">
          <Upload size={17} /> Import
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={importExcel} />
        </label>
        <button className="btn-secondary" onClick={exportExcel}><Download size={17} /> Export</button>
      </div>
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Remaining</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <Link to={`/students/${student._id}`} className="font-bold text-slate-900 hover:text-brand-700 dark:text-white">{student.fullName}</Link>
                    <p className="text-xs text-slate-500">{student.phone}</p>
                  </td>
                  <td className="px-4 py-3">{student.courseName}</td>
                  <td className="px-4 py-3">{formatCurrency(student.totalFees)}</td>
                  <td className="px-4 py-3">{formatCurrency(student.paidFees)}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(student.remainingFees)}</td>
                  <td className="px-4 py-3"><span className={`badge ${statusClass(student.status)}`}>{student.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a className="btn-secondary py-1.5 px-3" href={whatsappReminder(student)} target="_blank" rel="noreferrer" aria-label="Send reminder"><Send size={15} /></a>
                      <button className="btn-secondary py-1.5 px-3" onClick={() => setModal({ type: "qr", student })} aria-label="Open QR"><QrCode size={15} /></button>
                      <button className="btn-secondary py-1.5 px-3" onClick={() => setModal({ type: "edit", student })} aria-label="Edit student"><Edit size={15} /></button>
                      <button className="btn-secondary py-1.5 px-3" onClick={() => deleteStudent(student)} aria-label="Delete student"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
          <span className="text-slate-500">Page {meta.page || 1} of {meta.pages || 1}</span>
          <div className="flex gap-2">
            <button className="btn-secondary py-1.5" disabled={meta.page <= 1} onClick={() => load(meta.page - 1)}>Prev</button>
            <button className="btn-secondary py-1.5" disabled={meta.page >= meta.pages} onClick={() => load(meta.page + 1)}>Next</button>
          </div>
        </div>
      </div>
      {modal?.type === "qr" && (
        <QrPaymentModal student={modal.student} settings={settings} onClose={() => setModal(null)} />
      )}
      {modal && modal.type !== "qr" && (
        <Modal title={modal.type === "edit" ? "Edit Student" : "New Admission"} onClose={() => setModal(null)}>
          <StudentForm initialValues={modal.student} onSubmit={saveStudent} loading={loading} />
        </Modal>
      )}
    </>
  );
}
