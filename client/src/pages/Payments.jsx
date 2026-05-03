import { useEffect, useState } from "react";
import { ExternalLink, Printer, Send } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import { api } from "../lib/api";
import { formatCurrency, statusClass } from "../lib/utils";
import { receiptPageUrl, whatsappReceiptUrl } from "../lib/receipt";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  function load() {
    api.get("/payments", { params: { limit: 100 } }).then((res) => setPayments(res.data.data));
  }

  useEffect(load, []);

  async function action(id, type) {
    await api.patch(`/payments/${id}/${type}`);
    toast.success(type === "approve" ? "Payment approved" : "Payment rejected");
    load();
  }

  async function sendReceipt(paymentId) {
    try {
      const url = await whatsappReceiptUrl(paymentId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error.response?.data?.message || "Receipt share failed");
    }
  }

  function openReceipt(paymentId) {
    window.open(receiptPageUrl(paymentId), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <PageHeader title="Payments" description="Review receipts, screenshots, and verification-pending online payments." />
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60">
              <tr><th className="px-4 py-3">Receipt</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-4 py-3 font-semibold">{payment.receiptNumber}</td>
                  <td className="px-4 py-3">{payment.student?.fullName}</td>
                  <td className="px-4 py-3">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-3">{payment.mode}</td>
                  <td className="px-4 py-3"><span className={`badge ${statusClass(payment.status)}`}>{payment.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary px-3 py-1.5" onClick={() => openReceipt(payment._id)} title="View and print fee slip">
                        <Printer size={15} /> Slip
                      </button>
                      <button className="btn-secondary px-3 py-1.5" onClick={() => sendReceipt(payment._id)} title="Send fee slip on WhatsApp">
                        <Send size={15} /> WhatsApp
                      </button>
                      {payment.screenshotUrl && (
                        <a className="btn-secondary px-3 py-1.5" href={`${api.defaults.baseURL.replace("/api", "")}${payment.screenshotUrl}`} target="_blank" rel="noreferrer" title="Open payment screenshot">
                          <ExternalLink size={15} />
                        </a>
                      )}
                      {payment.status === "Verification Pending" && (
                        <>
                        <button className="btn-primary py-1.5" onClick={() => action(payment._id, "approve")}>Approve</button>
                        <button className="btn-secondary py-1.5" onClick={() => action(payment._id, "reject")}>Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
