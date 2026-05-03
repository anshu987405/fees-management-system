import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, Printer, Send } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import { api } from "../lib/api";
import { formatCurrency, statusClass, whatsappReminder } from "../lib/utils";
import { receiptPageUrl, whatsappReceiptUrl } from "../lib/receipt";

export default function StudentProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get(`/students/${id}`).then((res) => setProfile(res.data.data));
  }, [id]);

  if (!profile) return <div className="panel h-80 animate-pulse bg-slate-100" />;

  const { student, payments, qrDataUrl, upiUri } = profile;

  function printQr() {
    const win = window.open("", "_blank");
    win.document.write(`<img src="${qrDataUrl}" style="width:320px"><p>${student.fullName} - ${formatCurrency(student.remainingFees)}</p>`);
    win.print();
  }

  function openReceipt(paymentId) {
    window.open(receiptPageUrl(paymentId), "_blank", "noopener,noreferrer");
  }

  async function sendReceipt(paymentId) {
    try {
      const url = await whatsappReceiptUrl(paymentId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error.response?.data?.message || "Receipt share failed");
    }
  }

  return (
    <>
      <PageHeader
        title={student.fullName}
        description={`${student.courseName} • Father: ${student.fatherName} • Phone: ${student.phone}`}
        action={<Link className="btn-primary" to="/fees">Record Fee</Link>}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="panel grid gap-4 p-5 sm:grid-cols-4">
            <div><p className="text-sm text-slate-500">Total Fees</p><p className="text-xl font-extrabold">{formatCurrency(student.totalFees)}</p></div>
            <div><p className="text-sm text-slate-500">Paid</p><p className="text-xl font-extrabold text-emerald-600">{formatCurrency(student.paidFees)}</p></div>
            <div><p className="text-sm text-slate-500">Remaining</p><p className="text-xl font-extrabold text-amber-600">{formatCurrency(student.remainingFees)}</p></div>
            <div><p className="text-sm text-slate-500">Status</p><span className={`badge mt-2 ${statusClass(student.status)}`}>{student.status}</span></div>
          </div>
          <div className="panel overflow-hidden">
            <div className="border-b border-slate-200 p-4 dark:border-slate-800"><h2 className="font-extrabold">Payment History</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60">
                  <tr><th className="px-4 py-3">Receipt</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Slip</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-4 py-3 font-semibold">{payment.receiptNumber}</td>
                      <td className="px-4 py-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{payment.mode}</td>
                      <td className="px-4 py-3">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3"><span className={`badge ${statusClass(payment.status)}`}>{payment.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="btn-secondary px-3 py-1.5" onClick={() => openReceipt(payment._id)} title="View fee slip"><Printer size={15} /></button>
                          <button className="btn-secondary px-3 py-1.5" onClick={() => sendReceipt(payment._id)} title="Send fee slip on WhatsApp"><Send size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <aside className="panel p-5">
          <h2 className="text-lg font-extrabold">UPI QR Payment</h2>
          <p className="mt-1 text-sm text-slate-500">QR auto-updates with the remaining balance.</p>
          <div className="my-5 rounded-xl border border-slate-200 bg-white p-4">
            <img src={qrDataUrl} alt="UPI QR" className="mx-auto h-72 w-72" />
          </div>
          <p className="break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{upiUri}</p>
          <div className="mt-4 grid gap-2">
            <a className="btn-primary" href={qrDataUrl} download={`${student.fullName}-upi-qr.png`}><Download size={16} /> Download QR</a>
            <button className="btn-secondary" onClick={printQr}><Printer size={16} /> Print QR</button>
            <a className="btn-secondary" href={whatsappReminder(student)} target="_blank" rel="noreferrer"><Send size={16} /> WhatsApp Reminder</a>
          </div>
        </aside>
      </div>
    </>
  );
}
